#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILL_PATH = path.join(ROOT, 'skills', 'atelier', 'SKILL.md');

if (!fs.existsSync(SKILL_PATH)) {
  console.error(`Error: SKILL.md not found at ${SKILL_PATH}`);
  process.exit(1);
}

const skillContent = fs.readFileSync(SKILL_PATH, 'utf8');

// Extract UI rules (UI-1xx) and Backend rules (BE-2xx)
function extractRules(content) {
  const uiRegex = /- \*\*`(UI-\d+): ([^`]+)`\*\*\s*\n\s*- \*\*Requirement\*\*: ([^\n]+)/g;
  const beRegex = /- \*\*`(BE-\d+): ([^`]+)`\*\*\s*\n\s*- \*\*Requirement\*\*: ([^\n]+)/g;

  const uiRules = [];
  let match;
  while ((match = uiRegex.exec(content)) !== null) {
    uiRules.push(`- ${match[1]}: ${match[3]}`);
  }

  const beRules = [];
  while ((match = beRegex.exec(content)) !== null) {
    beRules.push(`- ${match[1]}: ${match[3]}`);
  }

  return { uiRules, beRules };
}

const { uiRules, beRules } = extractRules(skillContent);

function generateCoreRuleset() {
  return [
    'You must strictly obey the Atelier post-generation quality gate rules for all code generation:',
    '',
    '## UI/UX CRITIC RULES',
    ...uiRules,
    '',
    '## BACKEND ARCHITECTURE GUARD RULES',
    ...beRules,
    ''
  ].join('\n');
}

const coreRuleset = generateCoreRuleset();

const adapters = [
  {
    path: path.join(ROOT, 'adapters', '.cursorrules'),
    header: '# Atelier Quality Gate Adapter for Cursor (.cursorrules)\n# GENERATED FROM skills/atelier/SKILL.md — DO NOT EDIT DIRECTLY.\n# Run `npm run sync-adapters` to update.\n\n',
  },
  {
    path: path.join(ROOT, 'adapters', '.cursor', 'rules', 'atelier.mdc'),
    header: '---\ndescription: Atelier UI/UX and Backend Architecture Quality Gate\nglobs: *.{ts,tsx,js,jsx,py,html,css,json}\nalwaysApply: true\n---\n# Atelier Quality Gate Adapter for Cursor Rules (.cursor/rules/atelier.mdc)\n# GENERATED FROM skills/atelier/SKILL.md — DO NOT EDIT DIRECTLY.\n# Run `npm run sync-adapters` to update.\n\n',
  },
  {
    path: path.join(ROOT, 'adapters', '.windsurfrules'),
    header: '# Atelier Quality Gate Adapter for Windsurf (.windsurfrules)\n# GENERATED FROM skills/atelier/SKILL.md — DO NOT EDIT DIRECTLY.\n# Run `npm run sync-adapters` to update.\n\n',
  },
  {
    path: path.join(ROOT, 'adapters', 'CLAUDE.md'),
    header: '# Atelier Quality Gate Adapter for Claude Code (CLAUDE.md)\n# GENERATED FROM skills/atelier/SKILL.md — DO NOT EDIT DIRECTLY.\n# Run `npm run sync-adapters` to update.\n\n',
  },
  {
    path: path.join(ROOT, 'adapters', 'AGENTS.md'),
    header: '# Atelier Quality Gate Adapter for AGENTS.md\n# GENERATED FROM skills/atelier/SKILL.md — DO NOT EDIT DIRECTLY.\n# Run `npm run sync-adapters` to update.\n\n',
  },
  {
    path: path.join(ROOT, 'adapters', '.agents', 'rules', 'atelier.md'),
    header: '# Atelier Quality Gate Adapter for Antigravity / OpenCode Rules (.agents/rules/atelier.md)\n# GENERATED FROM skills/atelier/SKILL.md — DO NOT EDIT DIRECTLY.\n# Run `npm run sync-adapters` to update.\n\n',
  },
  {
    path: path.join(ROOT, 'adapters', '.github', 'copilot-instructions.md'),
    header: '# Atelier Quality Gate Adapter for GitHub Copilot (.github/copilot-instructions.md)\n# GENERATED FROM skills/atelier/SKILL.md — DO NOT EDIT DIRECTLY.\n# Run `npm run sync-adapters` to update.\n\n',
  },
];

adapters.forEach(adapter => {
  fs.mkdirSync(path.dirname(adapter.path), { recursive: true });
  const content = adapter.header + coreRuleset;
  fs.writeFileSync(adapter.path, content, 'utf8');
  console.log(`✓ Synchronized ${path.relative(ROOT, adapter.path)}`);
});

console.log(`\nAll ${adapters.length} adapters synchronized successfully with SKILL.md!`);
