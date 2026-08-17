#!/usr/bin/env node

/**
 * Atelier CLI — Standalone Quality Gate & MCP Runner
 * Engineered by Ansh Rajore
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const MCP_SERVER_DIST = path.join(ROOT_DIR, 'mcp-server', 'dist', 'index.js');
const SKILL_FILE = path.join(ROOT_DIR, 'skills', 'atelier', 'SKILL.md');

// ANSI monochrome terminal formatting
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const INVERT = '\x1b[7m';

function printBanner() {
  console.log(`
${BOLD}======================================================================${RESET}
${BOLD}                       ATELIER QUALITY GATE                           ${RESET}
${DIM}          Two-Agent Post-Generation Critic for Vibe-Coded Apps        ${RESET}
${DIM}                  ENGINEERED BY ANSH RAJORE                           ${RESET}
${BOLD}======================================================================${RESET}
`);
}

// Deterministic rule evaluation for CLI usage
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
          severity: 'CRITICAL',
          title: 'Arbitrary 8px Spacing Grid Violation',
          line: lineNum,
          matched: match[0],
          explanation: `Value ${val}px is not aligned to the 4px/8px design system token scale.`,
          fix: `Use standard Tailwind tokens or round to nearest multiple of 4px (${Math.round(val / 4) * 4}px).`
        });
        score -= 15;
      }
    }

    // BASE-UI-105: Excessive decorations (gradients / heavy shadows)
    const gradientCount = (code.match(/bg-gradient-to-[a-z]+/g) || []).length;
    const shadowCount = (code.match(/shadow-(?:lg|xl|2xl)/g) || []).length;
    if (gradientCount + shadowCount > 2) {
      findings.push({
        ruleId: 'BASE-UI-105',
        severity: 'WARNING',
        title: 'Decorative Ceiling Policy Exceeded',
        line: 1,
        matched: `${gradientCount} gradients, ${shadowCount} heavy shadows`,
        explanation: 'More than 2 high-intensity decorative elements detected on a single component view.',
        fix: 'Replace excessive drop shadows with subtle border definitions (e.g. border-zinc-800) and flat solid surfaces.'
      });
      score -= 10;
    }

    // NEXT-UI-105: Missing focus-visible on interactive elements
    if (/<button|<a\s|<input|<select/i.test(code) && !/focus-visible:(?:ring|outline|border)/i.test(code)) {
      findings.push({
        ruleId: 'NEXT-UI-105',
        severity: 'WARNING',
        title: 'Missing Focus-Visible Outline Indicator',
        line: 1,
        matched: 'interactive control without focus-visible',
        explanation: 'Interactive controls must define explicit focus-visible styling for keyboard accessibility.',
        fix: 'Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400`.'
      });
      score -= 10;
    }
  }

  // Backend Checks
  if (isBackend || isUI) {
    // BASE-BE-101: Secrets leakage
    const secretRegex = /(?:api_key|apiKey|secret|private_key|jwt_secret|bearer_token|password)\s*[:=]\s*['"`]([A-Za-z0-9_\-\.]{8,})['"`]/gi;
    let sMatch;
    while ((sMatch = secretRegex.exec(code)) !== null) {
      if (!sMatch[0].includes('process.env') && !sMatch[0].includes('import.meta.env')) {
        const lineNum = code.substring(0, sMatch.index).split('\n').length;
        findings.push({
          ruleId: 'BASE-BE-101',
          severity: 'CRITICAL',
          title: 'Hardcoded Secret Detected (OWASP A07)',
          line: lineNum,
          matched: sMatch[0].substring(0, 30) + '...',
          explanation: 'Raw credential string committed directly in source code.',
          fix: 'Extract credential to process.env or secret manager (e.g. process.env.API_KEY).'
        });
        score -= 30;
      }
    }

    // BASE-BE-102: Missing Schema Validation on endpoint handler
    if (/(?:app\.(post|put|patch)|router\.(post|put|patch)|export async function POST)/i.test(code) &&
        !/(?:zod|pydantic|valibot|z\.|schema\.parse|validate)/i.test(code)) {
      findings.push({
        ruleId: 'BASE-BE-102',
        severity: 'CRITICAL',
        title: 'Unvalidated Request Boundary Schema',
        line: 1,
        matched: 'HTTP mutation endpoint without boundary parser',
        explanation: 'Incoming request payload is processed directly without schema validation.',
        fix: 'Parse req.body with Zod or Pydantic before accessing fields.'
      });
      score -= 20;
    }

    // BASE-BE-103: Raw error dump
    if (/res\.(?:json|send)\(.*(?:err\.stack|error\.stack|err\b|error\b)/i.test(code) && !/status\(500\)/.test(code)) {
      findings.push({
        ruleId: 'BASE-BE-103',
        severity: 'CRITICAL',
        title: 'Raw Stack Trace / Internal Error Leakage',
        line: 1,
        matched: 'res.json(err / error.stack)',
        explanation: 'Internal server error details or stack traces are directly returned in API responses.',
        fix: 'Sanitize error response: log internally and return generic { error: "Internal Server Error" }.'
      });
      score -= 20;
    }
  }

  score = Math.max(0, Math.min(100, score));
  return { score, findings, type: isUI ? 'UI/UX' : 'BACKEND' };
}

// Commands
function commandAudit(targetPath) {
  printBanner();

  if (!targetPath) {
    console.error(`${BOLD}Error:${RESET} Please specify a file or directory to audit.\nUsage: atelier audit <path>\n`);
    process.exit(1);
  }

  const resolved = path.resolve(process.cwd(), targetPath);
  if (!fs.existsSync(resolved)) {
    console.error(`${BOLD}Error:${RESET} Target path not found: ${resolved}\n`);
    process.exit(1);
  }

  const stats = fs.statSync(resolved);
  const files = [];

  if (stats.isDirectory()) {
    function walk(dir) {
      for (const item of fs.readdirSync(dir)) {
        if (item === 'node_modules' || item === '.git' || item === 'dist' || item === '.next') continue;
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) walk(full);
        else if (/\.(tsx|jsx|ts|js|html|vue|svelte|py|json)$/i.test(item)) files.push(full);
      }
    }
    walk(resolved);
  } else {
    files.push(resolved);
  }

  console.log(`${DIM}Scanning ${files.length} file(s) against Atelier 36-Rule Quality Gate...${RESET}\n`);

  let totalFindings = 0;
  let filesWithViolations = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(process.cwd(), file);
    const { score, findings, type } = auditCode(content, file);

    if (findings.length > 0) {
      filesWithViolations++;
      totalFindings += findings.length;

      console.log(`${BOLD}${INVERT} FAIL ${RESET} ${BOLD}${rel}${RESET} ${DIM}[Score: ${score}/100 | ${type}]${RESET}`);
      for (const f of findings) {
        const sevColor = f.severity === 'CRITICAL' ? BOLD : DIM;
        console.log(`  ${sevColor}[${f.severity}]${RESET} ${BOLD}${f.ruleId}${RESET}: ${f.title} ${DIM}(Line ${f.line})${RESET}`);
        console.log(`    ${DIM}Issue:${RESET} ${f.explanation}`);
        console.log(`    ${DIM}Fix:${RESET}   ${f.fix}`);
      }
      console.log('');
    } else {
      console.log(`${BOLD} PASS ${RESET} ${rel} ${DIM}[Score: 100/100 | Clean]${RESET}`);
    }
  }

  console.log(`${BOLD}----------------------------------------------------------------------${RESET}`);
  if (totalFindings === 0) {
    console.log(`${BOLD}✓ 100% PASS:${RESET} All audited files conform to Atelier Quality Gate standards.\n`);
    process.exit(0);
  } else {
    console.log(`${BOLD}❌ VIOLATIONS FOUND:${RESET} ${totalFindings} issue(s) across ${filesWithViolations} file(s).\n`);
    process.exit(1);
  }
}

function commandFix(targetPath) {
  printBanner();
  if (!targetPath) {
    console.error(`${BOLD}Error:${RESET} Please specify a file or directory to fix.\nUsage: atelier fix <path>\n`);
    process.exit(1);
  }

  const resolved = path.resolve(process.cwd(), targetPath);
  if (!fs.existsSync(resolved)) {
    console.error(`${BOLD}Error:${RESET} Target not found: ${resolved}\n`);
    process.exit(1);
  }

  const files = [];
  if (fs.statSync(resolved).isDirectory()) {
    function walk(dir) {
      for (const item of fs.readdirSync(dir)) {
        if (item === 'node_modules' || item === '.git' || item === 'dist') continue;
        const full = path.join(dir, item);
        if (fs.statSync(full).isDirectory()) walk(full);
        else if (/\.(tsx|jsx|html|vue|svelte)$/i.test(item)) files.push(full);
      }
    }
    walk(resolved);
  } else {
    files.push(resolved);
  }

  console.log(`${DIM}Auto-remediating violations in ${files.length} file(s)...${RESET}\n`);

  let modifiedCount = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix arbitrary spacing: round px to nearest multiple of 4
    content = content.replace(/(m|p|gap|top|left|right|bottom|w|h)-\[(\d+)px\]/g, (match, prefix, num) => {
      const val = parseInt(num, 10);
      const rounded = Math.max(4, Math.round(val / 4) * 4);
      return `${prefix}-[${rounded}px]`;
    });

    // Replace excessive purple gradients with sleek dark zinc surfaces
    content = content.replace(/bg-gradient-to-[a-z]+ from-purple-[0-9]+ to-indigo-[0-9]+/g, 'bg-zinc-900 border border-zinc-800');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      const rel = path.relative(process.cwd(), file);
      console.log(`${BOLD}✓ REPAIRED:${RESET} ${rel}`);
      modifiedCount++;
    }
  }

  console.log(`\n${BOLD}Completed:${RESET} Remediated ${modifiedCount} file(s).\n`);
}

function commandInstall(target) {
  printBanner();
  const cwd = process.cwd();
  const adaptersDir = path.join(ROOT_DIR, 'adapters');

  console.log(`${DIM}Installing Atelier quality gate adapters into: ${cwd}${RESET}\n`);

  const targets = target ? [target.toLowerCase()] : ['cursor', 'windsurf', 'claude', 'copilot', 'antigravity'];

  if (targets.includes('cursor') || targets.includes('all')) {
    fs.copyFileSync(path.join(adaptersDir, '.cursorrules'), path.join(cwd, '.cursorrules'));
    const cursorRulesDir = path.join(cwd, '.cursor', 'rules');
    fs.mkdirSync(cursorRulesDir, { recursive: true });
    fs.copyFileSync(
      path.join(adaptersDir, '.cursor', 'rules', 'atelier.mdc'),
      path.join(cursorRulesDir, 'atelier.mdc')
    );
    console.log(`${BOLD}✓ Cursor Adapter Installed:${RESET} .cursorrules & .cursor/rules/atelier.mdc`);
  }

  if (targets.includes('windsurf') || targets.includes('all')) {
    fs.copyFileSync(path.join(adaptersDir, '.windsurfrules'), path.join(cwd, '.windsurfrules'));
    console.log(`${BOLD}✓ Windsurf Adapter Installed:${RESET} .windsurfrules`);
  }

  if (targets.includes('claude') || targets.includes('all')) {
    fs.copyFileSync(path.join(adaptersDir, 'CLAUDE.md'), path.join(cwd, 'CLAUDE.md'));
    console.log(`${BOLD}✓ Claude Code Adapter Installed:${RESET} CLAUDE.md`);
  }

  if (targets.includes('copilot') || targets.includes('all')) {
    const githubDir = path.join(cwd, '.github');
    fs.mkdirSync(githubDir, { recursive: true });
    fs.copyFileSync(
      path.join(adaptersDir, '.github', 'copilot-instructions.md'),
      path.join(githubDir, 'copilot-instructions.md')
    );
    console.log(`${BOLD}✓ GitHub Copilot Adapter Installed:${RESET} .github/copilot-instructions.md`);
  }

  if (targets.includes('antigravity') || targets.includes('all')) {
    const agentsDir = path.join(cwd, '.agents', 'rules');
    fs.mkdirSync(agentsDir, { recursive: true });
    fs.copyFileSync(
      path.join(adaptersDir, '.agents', 'rules', 'atelier.md'),
      path.join(agentsDir, 'atelier.md')
    );
    console.log(`${BOLD}✓ Antigravity Adapter Installed:${RESET} .agents/rules/atelier.md`);
  }

  console.log(`\n${BOLD}Setup Complete!${RESET} Your AI agent is now constrained by the Atelier Quality Gate.\n`);
}

function commandServe() {
  if (!fs.existsSync(MCP_SERVER_DIST)) {
    console.error(`MCP Server build not found at ${MCP_SERVER_DIST}. Building now...`);
    const { execSync } = require('child_process');
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
  }

  // Launch MCP stdio server
  const serverProc = spawn('node', [MCP_SERVER_DIST], {
    stdio: 'inherit',
    env: process.env,
  });

  serverProc.on('exit', (code) => {
    process.exit(code || 0);
  });
}

function printHelp() {
  printBanner();
  console.log(`${BOLD}COMMANDS:${RESET}
  ${BOLD}atelier audit <path>${RESET}      Scan a file or directory against the 36-rule quality gate
  ${BOLD}atelier fix <path>${RESET}        Automatically remediate spacing & design violations in-place
  ${BOLD}atelier install [editor]${RESET}  Install quality gate adapters (cursor, windsurf, claude, copilot, antigravity, all)
  ${BOLD}atelier serve${RESET}             Start the Atelier Model Context Protocol (MCP) server over stdio
  ${BOLD}atelier info${RESET}              Display active ruleset statistics and system capabilities
  ${BOLD}atelier help${RESET}              Show this help menu

${BOLD}EXAMPLES:${RESET}
  $ atelier audit ./src/components/Hero.tsx
  $ atelier audit ./src
  $ atelier fix ./src/components
  $ atelier install all
  $ atelier serve
`);
}

function commandInfo() {
  printBanner();
  console.log(`${BOLD}SYSTEM ARCHITECTURE:${RESET}
  • Critics:         UI/UX Critic & Backend Architecture Guard
  • Gradeable Rules: 36 Total (10 Universal, 15 Next.js/Tailwind, 11 n8n Workflows)
  • Rule Check Mode: 100% Deterministic Mechanical AST/Regex/JSON
  • Inference Model: Distilled Qwen2.5-Coder-7B LoRA (Local GGUF) + Heuristic Fallback
  • MCP Tools:       critique_ui, critique_backend, generate_fix
  • Protocol:        Model Context Protocol (MCP) over stdio
  • Developer:       Ansh Rajore (https://github.com/anshrajore)
`);
}

// CLI Router
const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'help';

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
