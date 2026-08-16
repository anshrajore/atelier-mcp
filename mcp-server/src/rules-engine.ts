import fs from 'fs';
import path from 'path';
import { RuleDefinition } from './types.js';

export class RulesEngine {
  private rules: Map<string, RuleDefinition> = new Map();
  private corpusDocs: Map<string, string> = new Map();

  constructor(skillPath?: string, corpusDir?: string) {
    this.loadRules(skillPath);
    this.loadCorpus(corpusDir);
  }

  private loadRules(customSkillPath?: string) {
    const defaultSkillPath = path.resolve(__dirname, '../../skills/atelier/SKILL.md');
    const targetPath = customSkillPath || defaultSkillPath;

    if (fs.existsSync(targetPath)) {
      try {
        const content = fs.readFileSync(targetPath, 'utf8');
        this.parseRulesFromSkill(content);
        return;
      } catch (err) {
        console.error(`Failed to read SKILL.md from ${targetPath}:`, err);
      }
    }

    // Fallback embedded rules
    this.loadEmbeddedFallbackRules();
  }

  private parseRulesFromSkill(content: string) {
    const ruleBlockRegex = /- \*\*`((UI|BE)-\d+): ([^`]+)`\*\*\s*\n\s*- \*\*Requirement\*\*: ([^\n]+)\s*\n\s*- \*\*Violation\*\*: ([^\n]+)\s*\n\s*- \*\*Fix\*\*: ([^\n]+)/g;
    let match;
    while ((match = ruleBlockRegex.exec(content)) !== null) {
      const [_, id, prefix, name, requirement, violation, fix] = match;
      this.rules.set(id, {
        id,
        category: prefix === 'UI' ? 'ui' : 'backend',
        name,
        requirement,
        violation,
        fix,
      });
    }
  }

  private loadEmbeddedFallbackRules() {
    const fallbackList: RuleDefinition[] = [
      {
        id: 'UI-101',
        category: 'ui',
        name: 'Harmonic Spacing Scale',
        requirement: 'Use a strict 4px / 8px harmonic spacing scale.',
        violation: 'Ad-hoc, arbitrary margins or paddings.',
        fix: 'Snap all dimensions to the nearest token on the 4px/8px grid.',
      },
      {
        id: 'UI-102',
        category: 'ui',
        name: 'Fluid & Responsive Boundary Constraints',
        requirement: 'Layout containers must gracefully wrap, flex, or scroll without horizontal page overflow.',
        violation: 'Fixed pixel widths on main containers.',
        fix: 'Use fluid constraints (max-w-7xl mx-auto w-full).',
      },
      {
        id: 'UI-103',
        category: 'ui',
        name: 'Strict Type Scale & Tracking',
        requirement: 'Maintain a clear visual hierarchy with distinct font sizes and calibrated letter-spacing.',
        violation: 'Huge untracked headline typography.',
        fix: 'Apply deliberate tracking tokens (e.g. tracking-tight on display headers).',
      },
      {
        id: 'UI-104',
        category: 'ui',
        name: 'Optical Balance & Line Length',
        requirement: 'Body text columns must be constrained to 45–75 characters per line.',
        violation: 'Full-width unbounded paragraphs.',
        fix: 'Wrap text content in constrained reading containers (max-w-prose).',
      },
      {
        id: 'UI-105',
        category: 'ui',
        name: 'Forbidden Purple/Violet on Dark',
        requirement: 'Reject the default purple/indigo glow on pitch-black background pattern.',
        violation: 'Dark themes consisting solely of #0b0b14 with #8b5cf6 glowing borders.',
        fix: 'Adopt tailored, balanced palettes using neutral slates, zincs, or warm grays with surface depth.',
      },
      {
        id: 'UI-106',
        category: 'ui',
        name: 'Forbidden Pulsing Headline Pills',
        requirement: 'Reject redundant biscuit/pill badges with a pulsing dot placed directly above the main h1.',
        violation: 'Decorative, unclickable pulsing pill badges serving purely as headline decoration.',
        fix: 'Remove the biscuit or convert it into a meaningful contextual breadcrumb.',
      },
      {
        id: 'UI-107',
        category: 'ui',
        name: 'Forbidden Gradient Keywords',
        requirement: 'Avoid multi-color text gradients applied arbitrarily across headline words.',
        violation: 'Random gradient text highlights on marketing copy.',
        fix: 'Use typographic weight, sizing, and purposeful single-color accenting.',
      },
      {
        id: 'UI-108',
        category: 'ui',
        name: 'Forbidden Over-Nested Cards',
        requirement: 'Maximum card nesting depth is 1.',
        violation: 'A rounded bordered card containing 3 smaller rounded cards, each containing another tag card.',
        fix: 'Flatten hierarchy using whitespace separation or subtle divider lines.',
      },
      {
        id: 'UI-109',
        category: 'ui',
        name: 'WCAG 2.1 AA Contrast Compliance',
        requirement: 'Text and interactive icons must meet minimum 4.5:1 contrast ratio against background.',
        violation: 'Low contrast light gray on white or dark gray on dark.',
        fix: 'Elevate text color tokens to ensure sufficient contrast ratios.',
      },
      {
        id: 'UI-110',
        category: 'ui',
        name: 'Complete Interactive State Matrix',
        requirement: 'Every clickable, focusable element MUST have explicit hover, focus-visible, active, and disabled styles.',
        violation: 'Buttons with only static background color and no focus ring or hover feedback.',
        fix: 'Provide complete state styling (focus-visible:ring-2, disabled:opacity-50, etc.).',
      },
      {
        id: 'BE-201',
        category: 'backend',
        name: 'Zero Hardcoded Secrets & Env Validation',
        requirement: 'Never commit, hardcode, or fallback-default API keys, tokens, JWT secrets, or DB passwords.',
        violation: 'Hardcoded credentials or insecure default fallback secrets.',
        fix: 'Extract to external environment configurations with fail-fast boot validation.',
      },
      {
        id: 'BE-202',
        category: 'backend',
        name: 'Strict Boundary Schema Validation',
        requirement: 'All external inputs must be strictly validated against a typed schema before execution.',
        violation: 'Direct untyped usage of req.body or request.json() without validation.',
        fix: 'Enforce schema parsers (Zod, Pydantic, Joi) that reject extra/malicious fields.',
      },
      {
        id: 'BE-203',
        category: 'backend',
        name: 'Mandatory Public Throttling',
        requirement: 'All publicly accessible, unauthenticated, auth-related, or AI-inference endpoints must be rate limited.',
        violation: 'Endpoints without rate limiting middleware.',
        fix: 'Attach rate limiting middleware with 429 Too Many Requests response and Retry-After header.',
      },
      {
        id: 'BE-204',
        category: 'backend',
        name: 'Elimination of N+1 Queries',
        requirement: 'Batch or join related entity fetches. Never perform database queries inside iterations.',
        violation: 'Looping over array of entities and executing database queries per item.',
        fix: 'Use batching (DataLoader, WHERE IN, Prisma include/select).',
      },
      {
        id: 'BE-205',
        category: 'backend',
        name: 'Unbounded Query Protection & Safe Pagination',
        requirement: 'Every collection query must specify deterministic sorting and hard limits on pagination.',
        violation: 'Unbounded findMany queries without limit or cursor pagination.',
        fix: 'Impose default and maximum limits with cursor/offset pagination.',
      },
      {
        id: 'BE-206',
        category: 'backend',
        name: 'Zero Orphan / Disconnected Nodes',
        requirement: 'In workflow orchestrators, all conditional branches and error paths must connect to explicit handlers.',
        violation: 'Disconnected error branches or dead-end conditional nodes.',
        fix: 'Wire unlinked output connectors to dead-letter queues, recovery handlers, or loggers.',
      },
      {
        id: 'BE-207',
        category: 'backend',
        name: 'Idempotency & Deterministic Error Propagation',
        requirement: 'State-mutating operations must support idempotency keys. Sanitize error responses without leaking stack traces.',
        violation: 'Retrying mutations without idempotency headers or returning 500 stack traces.',
        fix: 'Enforce idempotency middleware and sanitize error responses via global exception filters.',
      },
    ];

    for (const rule of fallbackList) {
      this.rules.set(rule.id, rule);
    }
  }

  private loadCorpus(customCorpusDir?: string) {
    const defaultCorpusDir = path.resolve(__dirname, '../../corpus');
    const targetDir = customCorpusDir || defaultCorpusDir;

    if (!fs.existsSync(targetDir)) return;

    const readRecursive = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          readRecursive(full);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const content = fs.readFileSync(full, 'utf8');
          const rel = path.relative(targetDir, full);
          this.corpusDocs.set(rel, content);
        }
      }
    };

    try {
      readRecursive(targetDir);
    } catch (err) {
      console.error(`Failed to read corpus from ${targetDir}:`, err);
    }
  }

  public getRule(id: string): RuleDefinition | undefined {
    return this.rules.get(id);
  }

  public getAllRules(category?: 'ui' | 'backend'): RuleDefinition[] {
    const all = Array.from(this.rules.values());
    if (!category) return all;
    return all.filter(r => r.category === category);
  }

  public getCorpusDocs(): Map<string, string> {
    return this.corpusDocs;
  }
}
