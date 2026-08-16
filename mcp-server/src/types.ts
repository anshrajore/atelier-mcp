export type RuleSeverity = 'critical' | 'warning' | 'suggestion';

export type CriticType = 'ui' | 'backend';

export interface RuleDefinition {
  id: string;
  category: string;
  name: string;
  requirement: string;
  violation: string;
  fix: string;
}

export interface FindingLocation {
  file?: string;
  line?: number;
  column?: number;
  snippet?: string;
}

export interface CritiqueFinding {
  ruleId: string;
  severity: RuleSeverity;
  title: string;
  location?: FindingLocation;
  explanation: string;
  concreteFix: string;
  diff?: string;
}

export interface CritiqueResult {
  critic: CriticType;
  score: number; // 0 - 100
  passed: boolean;
  summary: string;
  findings: CritiqueFinding[];
  timestamp: string;
}

export interface UICritiqueInput {
  code: string;
  filePath?: string;
  framework?: 'react' | 'vue' | 'html' | 'svelte' | 'solid';
  screenshotBase64?: string;
  screenshotPath?: string;
  designSystem?: 'tailwind' | 'radix' | 'shadcn' | 'vanilla' | 'material';
}

export interface BackendCritiqueInput {
  code: string;
  filePath?: string;
  language?: 'typescript' | 'javascript' | 'python' | 'go' | 'rust';
  framework?: 'express' | 'fastapi' | 'nest' | 'nextjs' | 'django' | 'workflow-n8n' | 'langgraph';
  isWorkflowJson?: boolean;
}

export interface GenerateFixInput {
  code: string;
  filePath?: string;
  critic: CriticType;
  findings: CritiqueFinding[];
}

export interface GenerateFixResult {
  originalCode: string;
  fixedCode: string;
  diff: string;
  resolvedRules: string[];
}
