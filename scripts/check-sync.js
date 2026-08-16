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

function extractRules(content) {
  const uiRegex = /### `(BASE-UI-\d+): ([^`]+)`\s*\n\s*- \*\*Statement\*\*: ([^\n]+)/g;
  const beRegex = /### `(BASE-BE-\d+): ([^`]+)`\s*\n\s*- \*\*Statement\*\*: ([^\n]+)/g;

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
    '## UNIVERSAL UI/UX RULES',
    ...uiRules,
    '',
    '## UNIVERSAL BACKEND ARCHITECTURE RULES',
    ...beRules,
    '',
    '## FRAMEWORK PRESETS (Available in skills/atelier/presets/)',
    '- Next.js + Tailwind: `skills/atelier/presets/nextjs-tailwind.md` (17 gradeable rules)',
    '- n8n Workflows: `skills/atelier/presets/n8n.md` (13 gradeable rules)',
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

let hasDrift = false;

for (const adapter of adapters) {
  const relPath = path.relative(ROOT, adapter.path);
  if (!fs.existsSync(adapter.path)) {
    console.error(`❌ Missing adapter: ${relPath}`);
    hasDrift = true;
    continue;
  }
  const existing = fs.readFileSync(adapter.path, 'utf8');
  const expected = adapter.header + coreRuleset;
  if (existing !== expected) {
    console.error(`❌ Adapter drift detected in: ${relPath}`);
    hasDrift = true;
  } else {
    console.log(`✓ In sync: ${relPath}`);
  }
}

if (hasDrift) {
  console.error('\nSync check failed! Run `npm run sync-adapters` to synchronize adapters with SKILL.md.');
  process.exit(1);
} else {
  console.log('\nAll adapters are perfectly in sync with SKILL.md.');
  process.exit(0);
}
