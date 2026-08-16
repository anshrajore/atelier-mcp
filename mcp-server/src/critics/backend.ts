import { BackendCritiqueInput, CritiqueResult } from '../types.js';
import { RulesEngine } from '../rules-engine.js';
import { LLMClient } from '../llm-client.js';

export async function handleCritiqueBackend(
  input: BackendCritiqueInput,
  rulesEngine: RulesEngine,
  llmClient: LLMClient
): Promise<CritiqueResult> {
  const backendRules = rulesEngine.getAllRules('backend');
  const corpusDocs = rulesEngine.getCorpusDocs();

  let corpusContext = '';
  for (const [docName, docContent] of corpusDocs.entries()) {
    if (docName.startsWith('backend/')) {
      corpusContext += `\n--- Reference Doc: ${docName} ---\n${docContent}\n`;
    }
  }

  const { findings, score, summary } = await llmClient.evaluateCode(
    'backend',
    input.code,
    backendRules,
    corpusContext
  );

  return {
    critic: 'backend',
    score,
    passed: score >= 80 && !findings.some(f => f.severity === 'critical'),
    summary,
    findings,
    timestamp: new Date().toISOString(),
  };
}
