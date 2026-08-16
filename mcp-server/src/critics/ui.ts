import { UICritiqueInput, CritiqueResult } from '../types.js';
import { RulesEngine } from '../rules-engine.js';
import { LLMClient } from '../llm-client.js';

export async function handleCritiqueUI(
  input: UICritiqueInput,
  rulesEngine: RulesEngine,
  llmClient: LLMClient
): Promise<CritiqueResult> {
  const uiRules = rulesEngine.getAllRules('ui');
  const corpusDocs = rulesEngine.getCorpusDocs();
  
  // Combine relevant corpus documents into grounding context
  let corpusContext = '';
  for (const [docName, docContent] of corpusDocs.entries()) {
    if (docName.startsWith('design/')) {
      corpusContext += `\n--- Reference Doc: ${docName} ---\n${docContent}\n`;
    }
  }

  const { findings, score, summary } = await llmClient.evaluateCode(
    'ui',
    input.code,
    uiRules,
    corpusContext,
    input.screenshotBase64
  );

  return {
    critic: 'ui',
    score,
    passed: score >= 80 && !findings.some(f => f.severity === 'critical'),
    summary,
    findings,
    timestamp: new Date().toISOString(),
  };
}
