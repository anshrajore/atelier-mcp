import { CritiqueFinding, CriticType, RuleDefinition } from './types.js';

export interface LLMConfig {
  provider?: 'mock' | 'heuristic' | 'openai' | 'anthropic' | 'gemini' | 'ollama' | 'vllm';
  model?: string;
  apiKey?: string;
  baseUrl?: string;
}

export class LLMClient {
  private config: LLMConfig;

  constructor(config?: LLMConfig) {
    this.config = {
      provider: (process.env.ATELIER_LLM_PROVIDER as any) || config?.provider || 'heuristic',
      model: process.env.ATELIER_MODEL || config?.model || 'default',
      apiKey: process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY || config?.apiKey,
      baseUrl: process.env.OLLAMA_BASE_URL || process.env.ATELIER_BASE_URL || config?.baseUrl,
    };
  }

  public async evaluateCode(
    critic: CriticType,
    code: string,
    rules: RuleDefinition[],
    corpusContext: string,
    screenshotBase64?: string
  ): Promise<{ findings: CritiqueFinding[]; score: number; summary: string }> {
    // If API credentials or local LLM endpoints are provided and configured, we can dispatch to the API
    if (this.config.provider === 'openai' && this.config.apiKey) {
      return this.callOpenAI(critic, code, rules, corpusContext);
    }
    if (this.config.provider === 'anthropic' && this.config.apiKey) {
      return this.callAnthropic(critic, code, rules, corpusContext);
    }
    if (this.config.provider === 'ollama' || this.config.provider === 'vllm') {
      return this.callLocalEndpoint(critic, code, rules, corpusContext);
    }

    // Default: High-precision deterministic heuristic engine
    return this.runHeuristicEvaluation(critic, code, rules);
  }

  private async callOpenAI(
    critic: CriticType,
    code: string,
    rules: RuleDefinition[],
    corpusContext: string
  ): Promise<{ findings: CritiqueFinding[]; score: number; summary: string }> {
    const systemPrompt = `You are Atelier's ${critic === 'ui' ? 'UI/UX Critic' : 'Backend Architecture Guard'}.
Analyze the provided code against these strict rules:
${rules.map(r => `[${r.id}] ${r.name}: ${r.requirement} (Violation: ${r.violation})`).join('\n')}

Reference Knowledge Context:
${corpusContext.slice(0, 3000)}

Respond ONLY with valid JSON conforming to:
{
  "score": number (0-100),
  "summary": string,
  "findings": [
    {
      "ruleId": string,
      "severity": "critical" | "warning" | "suggestion",
      "title": string,
      "location": { "line": number },
      "explanation": string,
      "concreteFix": string,
      "diff": string
    }
  ]
}`;

    try {
      const res = await fetch(`${this.config.baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model === 'default' ? 'gpt-4o' : this.config.model,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Code to audit:\n\`\`\`\n${code}\n\`\`\`` },
          ],
          temperature: 0.1,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API error: ${res.statusText}`);
      }

      const data: any = await res.json();
      const content = JSON.parse(data.choices[0].message.content);
      return {
        score: content.score ?? 80,
        summary: content.summary ?? 'Evaluated with OpenAI',
        findings: content.findings ?? [],
      };
    } catch (err) {
      console.error('LLM API call failed, falling back to heuristic engine:', err);
      return this.runHeuristicEvaluation(critic, code, rules);
    }
  }

  private async callAnthropic(
    critic: CriticType,
    code: string,
    rules: RuleDefinition[],
    corpusContext: string
  ): Promise<{ findings: CritiqueFinding[]; score: number; summary: string }> {
    // Anthropic API adapter
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey!,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: this.config.model === 'default' ? 'claude-3-5-sonnet-latest' : this.config.model,
          max_tokens: 4096,
          system: `You are Atelier's ${critic === 'ui' ? 'UI/UX Critic' : 'Backend Architecture Guard'}. Return ONLY valid JSON matching: { "score": number, "summary": string, "findings": [...] }`,
          messages: [
            {
              role: 'user',
              content: `Rules:\n${rules.map(r => `[${r.id}] ${r.name}: ${r.requirement}`).join('\n')}\n\nCode to evaluate:\n\`\`\`\n${code}\n\`\`\``,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`Anthropic API error: ${res.statusText}`);
      }

      const data: any = await res.json();
      const text = data.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: parsed.score ?? 80,
          summary: parsed.summary ?? 'Evaluated with Anthropic',
          findings: parsed.findings ?? [],
        };
      }
    } catch (err) {
      console.error('Anthropic API call failed, falling back to heuristic engine:', err);
    }
    return this.runHeuristicEvaluation(critic, code, rules);
  }

  private async callLocalEndpoint(
    critic: CriticType,
    code: string,
    rules: RuleDefinition[],
    corpusContext: string
  ): Promise<{ findings: CritiqueFinding[]; score: number; summary: string }> {
    const endpoint = this.config.baseUrl || 'http://localhost:11434/api/generate';
    try {
      const prompt = `You are Atelier Critic. Audit this code according to rules:\n${rules.map(r => r.id + ': ' + r.requirement).join('\n')}\n\nCode:\n${code}\n\nReturn JSON ONLY: { "score": number, "summary": string, "findings": [] }`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.config.model === 'default' ? 'qwen2.5-coder:7b' : this.config.model,
          prompt,
          format: 'json',
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`Local model error: ${res.statusText}`);
      const data: any = await res.json();
      const parsed = JSON.parse(data.response);
      return {
        score: parsed.score ?? 80,
        summary: parsed.summary ?? 'Evaluated with Local LLM',
        findings: parsed.findings ?? [],
      };
    } catch (err) {
      console.error('Local endpoint failed, falling back to heuristic engine:', err);
      return this.runHeuristicEvaluation(critic, code, rules);
    }
  }

  /**
   * Deterministic static analysis engine for instant zero-dependency execution.
   */
  public runHeuristicEvaluation(
    critic: CriticType,
    code: string,
    rules: RuleDefinition[]
  ): { findings: CritiqueFinding[]; score: number; summary: string } {
    const findings: CritiqueFinding[] = [];
    const lines = code.split('\n');

    if (critic === 'ui') {
      // Check UI-105: Forbidden Purple on Dark
      lines.forEach((line, idx) => {
        if (
          (line.includes('bg-[#0b0b14]') || line.includes('bg-[#09090b]') || line.includes('bg-black')) &&
          (line.includes('border-purple-') || line.includes('border-violet-') || line.includes('#8b5cf6') || line.includes('#a855f7'))
        ) {
          findings.push({
            ruleId: 'UI-105',
            severity: 'critical',
            title: 'Forbidden Purple-on-Dark AI Cliché Template',
            location: { line: idx + 1, snippet: line.trim() },
            explanation: 'Detected stereotypical purple glow on black background pattern.',
            concreteFix: 'Switch to a neutral slate/zinc surface (e.g. bg-zinc-900 border-zinc-800) with crisp contrast.',
            diff: `- ${line.trim()}\n+ ${line.replace(/border-(purple|violet)-\d+/g, 'border-zinc-800').replace(/bg-(black|\[#0b0b14\])/g, 'bg-zinc-900').trim()}`,
          });
        }
      });

      // Check UI-106: Forbidden Pulsing Pill above Headline
      lines.forEach((line, idx) => {
        const surrounding = lines.slice(Math.max(0, idx - 2), Math.min(lines.length, idx + 3)).join(' ');
        if (
          (line.includes('animate-pulse') || line.includes('animate-ping')) &&
          (surrounding.includes('rounded-full') || surrounding.includes('badge') || surrounding.includes('pill')) &&
          (surrounding.includes('New') || surrounding.includes('Introducing') || surrounding.includes('✨') || surrounding.includes('Announcing'))
        ) {
          findings.push({
            ruleId: 'UI-106',
            severity: 'warning',
            title: 'Forbidden Pulsing Headline Pill Badge',
            location: { line: idx + 1, snippet: line.trim() },
            explanation: 'Decorative pulsing biscuit badge placed above main headline dilutes visual focus.',
            concreteFix: 'Remove decorative pill or place functional status directly inside navigation/header.',
            diff: `- ${line.trim()}\n+ {/* Removed decorative pulsing pill badge */}`,
          });
        }
      });

      // Check UI-107: Forbidden Gradient Keywords
      lines.forEach((line, idx) => {
        if (
          line.includes('bg-clip-text') &&
          line.includes('text-transparent') &&
          (line.includes('from-purple') || line.includes('from-pink') || line.includes('from-indigo'))
        ) {
          findings.push({
            ruleId: 'UI-107',
            severity: 'warning',
            title: 'Forbidden Rainbow Gradient Text Keywords',
            location: { line: idx + 1, snippet: line.trim() },
            explanation: 'Multi-color gradient text clipping creates visual noise and degrades contrast.',
            concreteFix: 'Use deliberate typographic weight or a single solid accent color token.',
            diff: `- ${line.trim()}\n+ ${line.replace(/bg-clip-text text-transparent bg-gradient-to-[a-z0-9- ]+/g, 'text-foreground font-bold').trim()}`,
          });
        }
      });

      // Check UI-101: Harmonic Spacing Scale
      lines.forEach((line, idx) => {
        const arbitraryPxMatches = line.match(/(?:(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|top|left|right|bottom|h|w)-?\[(\d+)px\]|(?:margin|padding|gap|top|left|right|bottom):\s*(\d+)px)/g);
        if (arbitraryPxMatches) {
          arbitraryPxMatches.forEach(token => {
            const numMatch = token.match(/\d+/);
            if (numMatch) {
              const num = parseInt(numMatch[0], 10);
              if (num % 4 !== 0 && num > 2) {
                findings.push({
                  ruleId: 'UI-101',
                  severity: 'suggestion',
                  title: `Ad-hoc Uncalibrated Spacing (${num}px)`,
                  location: { line: idx + 1, snippet: line.trim() },
                  explanation: `Spacing value ${num}px violates the 4px/8px harmonic grid.`,
                  concreteFix: `Snap ${num}px to ${Math.round(num / 4) * 4}px or use Tailwind standard spacing tokens.`,
                });
              }
            }
          });
        }
      });

      // Check UI-110: Missing Interactive States on Buttons
      lines.forEach((line, idx) => {
        if (
          (line.includes('<button') || line.includes('<Button')) &&
          !line.includes('focus-visible:') &&
          !line.includes('hover:')
        ) {
          findings.push({
            ruleId: 'UI-110',
            severity: 'warning',
            title: 'Incomplete Button Interaction States',
            location: { line: idx + 1, snippet: line.trim() },
            explanation: 'Button lacks hover feedback and keyboard focus-visible rings.',
            concreteFix: 'Add hover:bg-opacity/90 and focus-visible:ring-2 focus-visible:outline-none states.',
          });
        }
      });
    }

    if (critic === 'backend') {
      // Check BE-201: Hardcoded Secrets & Fallback Defaults
      lines.forEach((line, idx) => {
        if (
          (line.includes('JWT_SECRET') || line.includes('API_KEY') || line.includes('SECRET_KEY') || line.includes('DATABASE_URL')) &&
          (line.includes('|| "') || line.includes("|| '") || line.includes('="') || line.includes("='")) &&
          !line.includes('process.env.NODE_ENV')
        ) {
          findings.push({
            ruleId: 'BE-201',
            severity: 'critical',
            title: 'Hardcoded Secret or Insecure Fallback Default',
            location: { line: idx + 1, snippet: line.trim() },
            explanation: 'Detected hardcoded credential fallback in source code.',
            concreteFix: 'Extract to validated environment schema (e.g. Zod) and fail fast at startup if missing.',
            diff: `- ${line.trim()}\n+ const secret = env.JWT_SECRET; // Validated via boot schema`,
          });
        }
      });

      // Check BE-202: Unvalidated Request Payload Boundary
      lines.forEach((line, idx) => {
        if (
          (line.includes('req.body.') || line.includes('const {') && lines.slice(Math.max(0, idx - 3), idx + 1).some(l => l.includes('req.body'))) &&
          !code.includes('.parse(') && !code.includes('.validate(') && !code.includes('z.object') && !code.includes('Pydantic')
        ) {
          findings.push({
            ruleId: 'BE-202',
            severity: 'critical',
            title: 'Missing Boundary Schema Validation on Request Body',
            location: { line: idx + 1, snippet: line.trim() },
            explanation: 'Request body properties are consumed directly without schema validation.',
            concreteFix: 'Pass req.body through a Zod/Pydantic parser to validate structure and types.',
          });
        }
      });

      // Check BE-204: N+1 Database Query in Loop
      lines.forEach((line, idx) => {
        if (
          (line.includes('for (') || line.includes('.map(') || line.includes('.forEach(')) &&
          (code.slice(code.indexOf(line), code.indexOf(line) + 400).includes('await db.') ||
           code.slice(code.indexOf(line), code.indexOf(line) + 400).includes('await prisma.') ||
           code.slice(code.indexOf(line), code.indexOf(line) + 400).includes('await User.') ||
           code.slice(code.indexOf(line), code.indexOf(line) + 400).includes('await Post.'))
        ) {
          findings.push({
            ruleId: 'BE-204',
            severity: 'critical',
            title: 'N+1 Database Query Pattern in Iteration',
            location: { line: idx + 1, snippet: line.trim() },
            explanation: 'Executing database queries inside iteration loops creates serious performance bottlenecks.',
            concreteFix: 'Batch query using SQL WHERE IN (...), Prisma include / select, or DataLoader.',
          });
        }
      });

      // Check BE-206: Disconnected/Orphan Workflow Nodes (Workflow JSON inspection)
      if (code.includes('"nodes"') && (code.includes('"connections"') || code.includes('"edges"'))) {
        try {
          const workflow = JSON.parse(code);
          const nodes = workflow.nodes || [];
          const connections = workflow.connections || {};
          const connectedTargets = new Set();
          const connectedSources = new Set();

          for (const sourceNode in connections) {
            connectedSources.add(sourceNode);
            const outputs = connections[sourceNode];
            for (const outType in outputs) {
              const branches = outputs[outType];
              for (const branch of branches) {
                for (const target of branch) {
                  connectedTargets.add(target.node);
                }
              }
            }
          }

          nodes.forEach((node: any) => {
            const isTrigger = node.type?.toLowerCase().includes('trigger') || node.type?.toLowerCase().includes('webhook');
            const isStart = node.name?.toLowerCase().includes('start') || node.name?.toLowerCase().includes('trigger');
            if (!isTrigger && !isStart && !connectedTargets.has(node.name)) {
              findings.push({
                ruleId: 'BE-206',
                severity: 'critical',
                title: `Orphan / Unreachable Workflow Node: "${node.name}"`,
                explanation: `Node "${node.name}" is defined in the graph but has no incoming execution connections.`,
                concreteFix: `Connect an incoming execution path to node "${node.name}" or remove it from the workflow.`,
              });
            }
          });
        } catch {
          // Non-JSON workflow code
        }
      }
    }

    // Calculate score: 100 base minus penalties
    let score = 100;
    findings.forEach(f => {
      if (f.severity === 'critical') score -= 25;
      else if (f.severity === 'warning') score -= 10;
      else score -= 5;
    });
    score = Math.max(0, Math.min(100, score));

    const passed = score >= 80 && !findings.some(f => f.severity === 'critical');
    const summary = passed
      ? `Quality gate passed (Score: ${score}/100) with ${findings.length} minor suggestions.`
      : `Quality gate failed (Score: ${score}/100) with ${findings.filter(f => f.severity === 'critical').length} critical issues.`;

    return { findings, score, summary };
  }
}
