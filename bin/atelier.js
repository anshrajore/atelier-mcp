#!/usr/bin/env node

/**
 * Atelier CLI — Standalone Quality Gate & MCP Runner
 * Engineered by Ansh Rajore
 * Windows-compatible (CMD, PowerShell, Git Bash)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const MCP_SERVER_DIST = path.join(ROOT_DIR, 'mcp-server', 'dist', 'index.js');
const SKILL_FILE = path.join(ROOT_DIR, 'skills', 'atelier', 'SKILL.md');

// ─── Cross-platform terminal color support ───────────────────────────────────
// Windows CMD/older PowerShell don't support ANSI. Only enable if stdout is a
// real TTY *and* the platform actually supports it (Win10 1511+ or non-Windows).
const IS_WINDOWS = process.platform === 'win32';
const supportsColor =
  process.stdout.isTTY &&
  (!IS_WINDOWS || (process.env.TERM_PROGRAM != null || process.env.WT_SESSION != null));

const BOLD   = supportsColor ? '\x1b[1m'  : '';
const DIM    = supportsColor ? '\x1b[2m'  : '';
const RESET  = supportsColor ? '\x1b[0m'  : '';
const GREEN  = supportsColor ? '\x1b[32m' : '';
const YELLOW = supportsColor ? '\x1b[33m' : '';
const RED    = supportsColor ? '\x1b[31m' : '';
const CYAN   = supportsColor ? '\x1b[36m' : '';

// ─── Safe file operations ─────────────────────────────────────────────────────
function safeCopy(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`${YELLOW}  SKIP${RESET} ${src} not found in package, skipping.`);
    return false;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return true;
}

// ─── Banner ───────────────────────────────────────────────────────────────────
function printBanner() {
  console.log(`
${BOLD}======================================================================${RESET}
${BOLD}                       ATELIER QUALITY GATE                          ${RESET}
${DIM}          Two-Agent Post-Generation Critic for Vibe-Coded Apps        ${RESET}
${DIM}                  ENGINEERED BY ANSH RAJORE                           ${RESET}
${BOLD}======================================================================${RESET}
`);
}

// ─── Deterministic rule evaluation ───────────────────────────────────────────
function auditCode(code, filename) {
  const isUI = /\.(tsx|jsx|html|vue|svelte|css)$/i.test(filename) || /className|<div>|<button|styled/i.test(code);
  const isBackend = /\.(ts|js|py|go|rs|json)$/i.test(filename) && !isUI;
  const findings = [];
  let score = 100;

  const lines = code.split('\n');

  // UI Checks
  if (isUI || !isBackend) {
    // BASE-UI-101: 8px spacing matrix
    const spacingRegex = /(?:m|p|gap|top|left|right|bottom|w|h)-\[(\d+)px\]/g;
    let match;
    while ((match = spacingRegex.exec(code)) !== null) {
      const val = parseInt(match[1], 10);
      if (val % 4 !== 0) {
        const lineNum = code.substring(0, match.index).split('\n').length;
        findings.push({
          ruleId: 'BASE-UI-101',
          severity: 'error',
          line: lineNum,
          message: `Non-harmonic spacing value: ${match[0]}. Must be a multiple of 4px.`,
          fix: match[0].replace(match[1], String(Math.round(val / 4) * 4)),
        });
        score -= 8;
      }
    }

    // BASE-UI-105: Anti-cliche gradient check
    if (/bg-gradient-to-[a-z]+.*from-[a-z]/.test(code) && /(rainbow|rainbow|via-purple|via-pink|via-red)/.test(code)) {
      findings.push({
        ruleId: 'BASE-UI-105',
        severity: 'warning',
        line: 1,
        message: 'Rainbow/multi-stop decorative gradient detected. Use 1 or 2 stops max, or remove entirely.',
      });
      score -= 5;
    }

    // NEXT-UI-105: Focus-visible check
    if (/onClick|onPress|<button|<a /.test(code) && !/focus-visible|focus:ring|focus:outline/.test(code)) {
      findings.push({
        ruleId: 'NEXT-UI-105',
        severity: 'error',
        line: 1,
        message: 'Interactive element missing focus-visible ring. Keyboard users cannot navigate this component.',
        fix: 'Add: focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none',
      });
      score -= 10;
    }

    // NEXT-UI-101: Raw <img> without next/image
    const imgRegex = /<img\s/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(code)) !== null) {
      const lineNum = code.substring(0, imgMatch.index).split('\n').length;
      findings.push({
        ruleId: 'NEXT-UI-101',
        severity: 'error',
        line: lineNum,
        message: 'Raw <img> element without next/image causes Layout Shift (CLS). Use <Image> from "next/image".',
        fix: 'Replace with: import Image from "next/image"; → <Image src=... width=... height=... />',
      });
      score -= 10;
    }
  }

  // Backend Checks
  if (isBackend || !isUI) {
    // BASE-BE-101: Hardcoded secrets
    const secretPatterns = [
      { r: /['"`][A-Za-z0-9+/]{32,}={0,2}['"`]/, label: 'Potential hardcoded API key or token' },
      { r: /JWT_SECRET\s*=\s*['"`][^'"` ]{4,}['"`]/, label: 'Hardcoded JWT secret' },
      { r: /password\s*=\s*['"`][^'"` ]{4,}['"`]/i, label: 'Hardcoded password' },
      { r: /sk_live_[A-Za-z0-9]{10,}/, label: 'Hardcoded Stripe live key' },
    ];
    secretPatterns.forEach(({ r, label }) => {
      if (r.test(code)) {
        const m = code.match(r);
        if (m) {
          const lineNum = code.substring(0, code.indexOf(m[0])).split('\n').length;
          findings.push({
            ruleId: 'BASE-BE-101',
            severity: 'critical',
            line: lineNum,
            message: `${label}. Move to environment variables (process.env.SECRET_NAME).`,
            fix: 'Replace with: process.env.YOUR_SECRET_NAME || ""',
          });
          score -= 15;
        }
      }
    });

    // BASE-BE-104: Missing try/catch on async
    if (/async\s+\w+\s*\(/.test(code) && !/try\s*\{/.test(code) && !/\.catch\(/.test(code)) {
      findings.push({
        ruleId: 'BASE-BE-104',
        severity: 'error',
        line: 1,
        message: 'Async function has no error boundary (try/catch or .catch()). All async operations must handle rejections.',
        fix: 'Wrap async logic in: try { ... } catch (err) { console.error(err); res.status(500).json({ error: "Internal error" }); }',
      });
      score -= 12;
    }

    // BASE-BE-105: Missing input validation
    if (/(req\.body|req\.query|request\.json\(\))/.test(code) && !/z\.|Joi\.|yup\.|zod/.test(code)) {
      findings.push({
        ruleId: 'BASE-BE-105',
        severity: 'error',
        line: 1,
        message: 'External request input used without schema validation (Zod/Joi/Yup). All inputs must be validated.',
        fix: 'Add: import { z } from "zod"; const schema = z.object({...}); const data = schema.parse(req.body);',
      });
      score -= 10;
    }
  }

  return { score: Math.max(score, 0), findings };
}

// ─── CLI: audit command ───────────────────────────────────────────────────────
function commandAudit(targetPath) {
  printBanner();
  if (!targetPath) {
    console.error(`${RED}Error:${RESET} Provide a file or directory path.\n  Example: atelier audit ./src/components\n`);
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), targetPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`${RED}Error:${RESET} Path not found: ${resolvedPath}\n`);
    process.exit(1);
  }

  const stat = fs.statSync(resolvedPath);
  const files = stat.isDirectory()
    ? walkDir(resolvedPath).filter(f => /\.(tsx|jsx|ts|js|css|html|vue|svelte|py|go)$/i.test(f))
    : [resolvedPath];

  if (files.length === 0) {
    console.log(`${DIM}No auditable files found in: ${resolvedPath}${RESET}\n`);
    return;
  }

  let totalScore = 0;
  let totalFindings = 0;

  files.forEach(file => {
    const code = fs.readFileSync(file, 'utf8');
    const rel = path.relative(process.cwd(), file);
    const { score, findings } = auditCode(code, file);
    totalScore += score;
    totalFindings += findings.length;

    const scoreColor = score === 100 ? GREEN : score >= 80 ? YELLOW : RED;
    console.log(`${BOLD}${rel}${RESET}  ${scoreColor}Score: ${score}/100${RESET}`);

    if (findings.length === 0) {
      console.log(`  ${GREEN}✓ No violations found${RESET}`);
    } else {
      findings.forEach(f => {
        const sev = f.severity === 'critical' ? RED : f.severity === 'error' ? RED : YELLOW;
        console.log(`  ${sev}[${f.ruleId}] Line ${f.line}: ${f.message}${RESET}`);
        if (f.fix) console.log(`  ${DIM}  FIX: ${f.fix}${RESET}`);
      });
    }
    console.log('');
  });

  const avg = Math.round(totalScore / files.length);
  const avgColor = avg === 100 ? GREEN : avg >= 80 ? YELLOW : RED;
  console.log(`${BOLD}SUMMARY:${RESET} ${files.length} file(s) | ${totalFindings} violation(s) | Average Score: ${avgColor}${avg}/100${RESET}\n`);
}

function walkDir(dir) {
  const results = [];
  const skip = ['node_modules', '.git', '.next', 'dist', 'build', 'out', '__pycache__'];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (skip.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) results.push(...walkDir(full));
    else results.push(full);
  }
  return results;
}

// ─── CLI: fix command ─────────────────────────────────────────────────────────
function commandFix(targetPath) {
  printBanner();
  if (!targetPath) {
    console.error(`${RED}Error:${RESET} Provide a file or directory path.\n  Example: atelier fix ./src/components\n`);
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), targetPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`${RED}Error:${RESET} Path not found: ${resolvedPath}\n`);
    process.exit(1);
  }

  const stat = fs.statSync(resolvedPath);
  const files = stat.isDirectory()
    ? walkDir(resolvedPath).filter(f => /\.(tsx|jsx|ts|js|css|html)$/i.test(f))
    : [resolvedPath];

  let modifiedCount = 0;
  files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    const original = code;

    // Fix non-harmonic spacing values
    code = code.replace(/(?:m|p|gap|top|left|right|bottom|w|h)-\[(\d+)px\]/g, (match, val) => {
      const n = parseInt(val, 10);
      if (n % 4 !== 0) {
        const fixed = Math.round(n / 4) * 4;
        return match.replace(val, String(fixed));
      }
      return match;
    });

    if (code !== original) {
      fs.writeFileSync(file, code, 'utf8');
      const rel = path.relative(process.cwd(), file);
      console.log(`${GREEN}FIXED:${RESET} ${rel}`);
      modifiedCount++;
    }
  });

  console.log(`\n${BOLD}Completed:${RESET} Remediated ${modifiedCount} file(s).\n`);
}

// ─── CLI: install command ─────────────────────────────────────────────────────
function commandInstall(target) {
  printBanner();
  const cwd = process.cwd();
  const adaptersDir = path.join(ROOT_DIR, 'adapters');

  console.log(`${DIM}Installing Atelier quality gate adapters into:${RESET}\n  ${cwd}\n`);

  const t = (target || 'all').toLowerCase();
  const targets = t === 'all'
    ? ['cursor', 'windsurf', 'claude', 'copilot', 'antigravity']
    : [t];

  let installed = 0;

  if (targets.includes('cursor')) {
    const ok1 = safeCopy(
      path.join(adaptersDir, '.cursorrules'),
      path.join(cwd, '.cursorrules')
    );
    const ok2 = safeCopy(
      path.join(adaptersDir, '.cursor', 'rules', 'atelier.mdc'),
      path.join(cwd, '.cursor', 'rules', 'atelier.mdc')
    );
    if (ok1 || ok2) {
      console.log(`  ${GREEN}+${RESET} ${BOLD}Cursor${RESET}        .cursorrules & .cursor/rules/atelier.mdc`);
      installed++;
    }
  }

  if (targets.includes('windsurf')) {
    const ok = safeCopy(
      path.join(adaptersDir, '.windsurfrules'),
      path.join(cwd, '.windsurfrules')
    );
    if (ok) {
      console.log(`  ${GREEN}+${RESET} ${BOLD}Windsurf${RESET}      .windsurfrules`);
      installed++;
    }
  }

  if (targets.includes('claude')) {
    const ok1 = safeCopy(
      path.join(adaptersDir, 'CLAUDE.md'),
      path.join(cwd, 'CLAUDE.md')
    );
    const ok2 = safeCopy(
      path.join(adaptersDir, 'AGENTS.md'),
      path.join(cwd, 'AGENTS.md')
    );
    if (ok1 || ok2) {
      console.log(`  ${GREEN}+${RESET} ${BOLD}Claude Code${RESET}   CLAUDE.md & AGENTS.md`);
      installed++;
    }
  }

  if (targets.includes('copilot')) {
    const ok = safeCopy(
      path.join(adaptersDir, '.github', 'copilot-instructions.md'),
      path.join(cwd, '.github', 'copilot-instructions.md')
    );
    if (ok) {
      console.log(`  ${GREEN}+${RESET} ${BOLD}Copilot${RESET}       .github/copilot-instructions.md`);
      installed++;
    }
  }

  if (targets.includes('antigravity')) {
    const ok = safeCopy(
      path.join(adaptersDir, '.agents', 'rules', 'atelier.md'),
      path.join(cwd, '.agents', 'rules', 'atelier.md')
    );
    if (ok) {
      console.log(`  ${GREEN}+${RESET} ${BOLD}Antigravity${RESET}   .agents/rules/atelier.md`);
      installed++;
    }
  }

  if (installed === 0) {
    console.log(`${YELLOW}Warning:${RESET} No adapter files were installed. Check the package is complete.\n`);
  } else {
    console.log(`\n${BOLD}${GREEN}Setup Complete!${RESET} ${installed} adapter(s) installed.`);
    console.log(`${DIM}Your AI coding assistant is now constrained by the Atelier Quality Gate.${RESET}\n`);
  }
}

// ─── CLI: serve (MCP stdio) command ──────────────────────────────────────────
function commandServe() {
  // Build MCP server if not already built
  if (!fs.existsSync(MCP_SERVER_DIST)) {
    console.error(`MCP server not built. Building now...`);
    try {
      // Use cross-platform approach: run npm in mcp-server directory
      execSync('npm install', { cwd: path.join(ROOT_DIR, 'mcp-server'), stdio: 'inherit', shell: true });
      execSync('npm run build', { cwd: path.join(ROOT_DIR, 'mcp-server'), stdio: 'inherit', shell: true });
    } catch (e) {
      console.error(`Build failed: ${e.message}`);
      process.exit(1);
    }
  }

  const serverProc = spawn('node', [MCP_SERVER_DIST], {
    stdio: 'inherit',
    env: process.env,
    shell: IS_WINDOWS, // On Windows, spawn with shell:true for better compatibility
  });

  serverProc.on('error', (err) => {
    console.error(`Failed to start MCP server: ${err.message}`);
    process.exit(1);
  });

  serverProc.on('exit', (code) => {
    process.exit(code || 0);
  });
}

// ─── Help & Info ──────────────────────────────────────────────────────────────
function printHelp() {
  printBanner();
  console.log(`${BOLD}USAGE:${RESET}
  npx -y atelier-quality-gate <command> [options]

${BOLD}COMMANDS:${RESET}
  ${BOLD}audit <path>${RESET}        Scan a file or directory against 36 quality rules
  ${BOLD}fix <path>${RESET}          Auto-remediate spacing & design violations in-place
  ${BOLD}install [editor]${RESET}    Install quality gate adapters
                      editors: cursor | windsurf | claude | copilot | antigravity | all
  ${BOLD}serve${RESET}               Start the Atelier MCP stdio server
  ${BOLD}info${RESET}                Show ruleset statistics and system info
  ${BOLD}help${RESET}                Show this help menu

${BOLD}EXAMPLES:${RESET}
  $ npx -y atelier-quality-gate audit ./src/components/Hero.tsx
  $ npx -y atelier-quality-gate audit ./src
  $ npx -y atelier-quality-gate fix ./src/components
  $ npx -y atelier-quality-gate install all
  $ npx -y atelier-quality-gate install cursor
  $ npx -y atelier-quality-gate serve

${BOLD}PLATFORM:${RESET}
  Supports macOS, Linux, and Windows (CMD, PowerShell, Git Bash, WSL)
`);
}

function commandInfo() {
  printBanner();
  console.log(`${BOLD}SYSTEM INFO:${RESET}
  Platform:          ${process.platform} ${os.release()}
  Node.js:           ${process.version}
  Package root:      ${ROOT_DIR}
  MCP Server:        ${fs.existsSync(MCP_SERVER_DIST) ? GREEN + 'READY' + RESET : YELLOW + 'NOT BUILT' + RESET}
  Skill file:        ${fs.existsSync(SKILL_FILE) ? GREEN + 'FOUND' + RESET : RED + 'MISSING' + RESET}
  Color support:     ${supportsColor ? GREEN + 'YES' + RESET : DIM + 'NO (plain text mode)' + RESET}

${BOLD}CRITICS:${RESET}
  • UI/UX Critic      — 18 rules (spacing, typography, contrast, hierarchy)
  • Backend Guard     — 18 rules (secrets, validation, transactions, rate limiting)

${BOLD}ADAPTERS:${RESET}
  Cursor / Windsurf / Claude Code / GitHub Copilot / Google Antigravity

${BOLD}DEVELOPER:${RESET}
  Ansh Rajore — https://github.com/anshrajore/atelier-mcp
  NPM:          https://www.npmjs.com/package/atelier-quality-gate
`);
}

// ─── CLI Router ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const command = (args[0] || 'help').toLowerCase();

switch (command) {
  case 'audit':
  case 'check':
    commandAudit(args[1]);
    break;
  case 'fix':
    commandFix(args[1]);
    break;
  case 'install':
  case 'init':
    commandInstall(args[1] || 'all');
    break;
  case 'serve':
  case 'start':
    commandServe();
    break;
  case 'info':
    commandInfo();
    break;
  case 'help':
  case '--help':
  case '-h':
  default:
    printHelp();
    break;
}

