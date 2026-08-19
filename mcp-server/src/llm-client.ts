import ts from 'typescript';
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
   * Deterministic static analysis engine utilizing TypeScript compiler AST.
   */
  public runHeuristicEvaluation(
    critic: CriticType,
    code: string,
    rules: RuleDefinition[]
  ): { findings: CritiqueFinding[]; score: number; summary: string } {
    const findings: CritiqueFinding[] = [];
    const lines = code.split('\n');
    let parsedWithAST = false;

    // Check if code block contains typical JS/TS declarations to decide on AST parse
    const looksLikeJsTs = /import\s|const\s|let\s|function\s|class\s|export\s|<\w+\s+className=/.test(code);

    if (looksLikeJsTs) {
      try {
        const sourceFile = ts.createSourceFile('temp.tsx', code, ts.ScriptTarget.Latest, true);

        const visit = (node: ts.Node) => {
          // --- UI Critic AST Rules ---
          if (critic === 'ui') {
          // 1. Spacing Violations: snaps invalid pixel grids
          if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name) && node.name.text === 'className' && node.initializer) {
            let classNameVal = '';
            if (ts.isStringLiteral(node.initializer)) {
              classNameVal = node.initializer.text;
            } else if (ts.isJsxExpression(node.initializer) && node.initializer.expression && ts.isStringLiteral(node.initializer.expression)) {
              classNameVal = node.initializer.expression.text;
            }
            if (classNameVal) {
              const spacingMatches = classNameVal.match(/(?:m|p|gap|top|left|right|bottom|w|h)-\[(\d+)px\]/g) || [];
              spacingMatches.forEach(m => {
                const valMatch = m.match(/\d+/);
                if (valMatch) {
                  const val = parseInt(valMatch[0], 10);
                  if (val % 4 !== 0 && val > 2) {
                    const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
                    const rounded = Math.round(val / 4) * 4;
                    const fixStr = m.replace(String(val), String(rounded));
                    findings.push({
                      ruleId: 'UI-101',
                      severity: 'suggestion',
                      title: `Ad-hoc Uncalibrated Spacing (${val}px)`,
                      location: { line: line + 1, snippet: node.getText(sourceFile) },
                      explanation: `Spacing value ${val}px violates the 4px/8px design system spacing grid.`,
                      concreteFix: `Snap ${val}px to ${rounded}px or use standard Tailwind spacing tokens.`,
                      diff: `- className="${classNameVal}"\n+ className="${classNameVal.replace(m, fixStr)}"`,
                    });
                  }
                }
              });
            }
          }

          // 2. Interactive States & Keyboard Focus on Buttons / Links
          if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const tagName = node.tagName.getText(sourceFile);
            if (tagName === 'button' || tagName === 'Button') {
              let hasFocusVisible = false;
              let hasHover = false;
              let classNameVal = '';

              const attrs = ts.isJsxOpeningElement(node) ? node.attributes.properties : node.attributes.properties;
              attrs.forEach(attr => {
                if (ts.isJsxAttribute(attr) && ts.isIdentifier(attr.name) && attr.name.text === 'className' && attr.initializer) {
                  const valText = attr.initializer.getText(sourceFile);
                  if (valText.includes('focus-visible:')) hasFocusVisible = true;
                  if (valText.includes('hover:')) hasHover = true;
                  classNameVal = valText.replace(/['"`]/g, '');
                }
              });

              if (!hasFocusVisible) {
                const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
                findings.push({
                  ruleId: 'UI-110',
                  severity: 'warning',
                  title: 'Incomplete Button Keyboard Focus Ring',
                  location: { line: line + 1, snippet: node.getText(sourceFile) },
                  explanation: 'Interactive controls lack visible focus indicators for keyboard navigation.',
                  concreteFix: 'Add focus-visible:ring-2 focus-visible:outline-none states.',
                  diff: classNameVal
                    ? `- className="${classNameVal}"\n+ className="${classNameVal} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a00]"`
                    : `+ focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a00]`,
                });
              }
            }
          }

          // 3. Raw img layout shifts
          if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
            const tagName = node.tagName.getText(sourceFile);
            if (tagName === 'img') {
              const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
              findings.push({
                ruleId: 'UI-102',
                severity: 'critical',
                title: 'Forbidden Raw <img> Element (CLS)',
                location: { line: line + 1, snippet: node.getText(sourceFile) },
                explanation: 'Raw <img> element without next/image causes Visual Layout Shift (CLS).',
                concreteFix: 'Use <Image> from "next/image" with explicit width and height properties.',
              });
            }
          }
        }

        // --- Backend Guard AST Rules ---
        if (critic === 'backend') {
          // 1. Secrets variable declarations
          if (ts.isVariableDeclaration(node) && node.initializer) {
            const varName = node.name.getText(sourceFile).toUpperCase();
            if (
              (varName.includes('SECRET') || varName.includes('KEY') || varName.includes('TOKEN') || varName.includes('PASSWORD')) &&
              ts.isStringLiteral(node.initializer)
            ) {
              const secretVal = node.initializer.text;
              if (secretVal.length > 5 && !secretVal.startsWith('process.env') && !secretVal.includes('placeholder')) {
                const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
                findings.push({
                  ruleId: 'BE-201',
                  severity: 'critical',
                  title: 'Hardcoded Cryptographic Secret / Credential',
                  location: { line: line + 1, snippet: node.getText(sourceFile) },
                  explanation: `Variable '${node.name.getText(sourceFile)}' is assigned a plaintext secret: "${secretVal.slice(0, 4)}..."`,
                  concreteFix: 'Extract to process.env configuration file with boot verification.',
                  diff: `- const ${node.name.getText(sourceFile)} = "${secretVal}";\n+ const ${node.name.getText(sourceFile)} = process.env.${node.name.getText(sourceFile)} || "";`,
                });
              }
            }
          }

          // 2. Async function try/catch exception boundaries
          if (
            ts.isFunctionDeclaration(node) ||
            ts.isArrowFunction(node) ||
            ts.isFunctionExpression(node) ||
            ts.isMethodDeclaration(node)
          ) {
            const isAsync = node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword);
            if (isAsync && node.body) {
              const bodyText = node.body.getText(sourceFile);
              const hasTryCatch = bodyText.includes('try') && bodyText.includes('catch');
              if (!hasTryCatch) {
                const funcName = ts.isFunctionDeclaration(node) && node.name ? node.name.text : 'anonymous';
                const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
                findings.push({
                  ruleId: 'BE-207',
                  severity: 'warning',
                    title: `Missing Async Error Boundary in "${funcName}"`,
                    location: { line: line + 1, snippet: node.getText(sourceFile).split('\n')[0] },
                    explanation: 'Async function execution path lacks top-level exception handler boundaries.',
                    concreteFix: 'Wrap async execution logic in try { ... } catch (err) { ... } filters.',
                  });
                }
              }
            }

            // 3. N+1 database queries in loop
            if (
              ts.isForStatement(node) ||
              ts.isForOfStatement(node) ||
              ts.isForInStatement(node) ||
              ts.isWhileStatement(node) ||
              ts.isDoStatement(node)
            ) {
              let hasAwaitQuery = false;
              let querySnippet = '';

              const checkLoop = (child: ts.Node) => {
                if (ts.isAwaitExpression(child)) {
                  const awaitText = child.getText(sourceFile);
                  if (
                    awaitText.includes('db.') ||
                    awaitText.includes('prisma.') ||
                    awaitText.includes('Query') ||
                    awaitText.includes('find') ||
                    awaitText.includes('create')
                  ) {
                    hasAwaitQuery = true;
                    querySnippet = awaitText;
                  }
                }
                ts.forEachChild(child, checkLoop);
              };
              ts.forEachChild(node, checkLoop);

              if (hasAwaitQuery) {
                const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
                findings.push({
                  ruleId: 'BE-204',
                  severity: 'critical',
                  title: 'N+1 Database Query in Loop Iteration',
                  location: { line: line + 1, snippet: querySnippet },
                  explanation: 'Executing database operations inside loops leads to high DB latency.',
                  concreteFix: 'Batch requests using join tables or fetch arrays using WHERE IN clause.',
                });
              }
            }
          }

          ts.forEachChild(node, visit);
        };

        visit(sourceFile);
        parsedWithAST = true;
      } catch (err) {
        console.warn('TypeScript Compiler API failed to parse. Falling back to regex.', err);
      }
    }

    // --- Fallback Regex Checks (For non-JS/TS or if AST parse didn't cover/run) ---
    if (critic === 'ui') {
      // Check UI-105: Forbidden Purple on Dark
      if (!parsedWithAST || findings.length === 0) {
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
      }

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
            explanation: 'Multi-color gradient text creates high visual noise.',
            concreteFix: 'Use typographic weight or single solid accent color token.',
            diff: `- ${line.trim()}\n+ ${line.replace(/bg-clip-text text-transparent bg-gradient-to-[a-z0-9- ]+/g, 'text-foreground font-bold').trim()}`,
          });
        }
      });
    }

    if (critic === 'backend') {
      // Check BE-202: Unvalidated Request Payload Boundary
      if (!parsedWithAST || findings.length === 0) {
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
      }

      // Check BE-206: Disconnected/Orphan Workflow Nodes
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
          // Ignore JSON errors
        }
      }
    }

    // Deduplicate findings by ruleId & line number
    const seen = new Set<string>();
    const uniqueFindings = findings.filter(f => {
      const key = `${f.ruleId}:${f.location?.line || 0}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Calculate score: 100 base minus penalties
    let score = 100;
    uniqueFindings.forEach(f => {
      if (f.severity === 'critical') score -= 25;
      else if (f.severity === 'warning') score -= 10;
      else score -= 5;
    });
    score = Math.max(0, Math.min(100, score));

    const passed = score >= 80 && !uniqueFindings.some(f => f.severity === 'critical');
    const summary = passed
      ? `Quality gate passed (Score: ${score}/100) with ${uniqueFindings.length} minor suggestions.`
      : `Quality gate failed (Score: ${score}/100) with ${uniqueFindings.filter(f => f.severity === 'critical').length} critical issues.`;

    return { findings: uniqueFindings, score, summary };
  }
}
