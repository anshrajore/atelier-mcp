import fs from 'fs';
import path from 'path';
import { RulesEngine } from '../mcp-server/src/rules-engine.js';
import { LLMClient } from '../mcp-server/src/llm-client.js';
import { handleCritiqueUI } from '../mcp-server/src/critics/ui.js';
import { handleCritiqueBackend } from '../mcp-server/src/critics/backend.js';

async function runBenchmarks() {
  console.log('=====================================================');
  console.log('         ATELIER BENCHMARK EVALUATION SUITE          ');
  console.log('=====================================================\n');

  const rulesEngine = new RulesEngine();
  const llmClient = new LLMClient({ provider: 'heuristic' });

  const casesDir = path.resolve(__dirname, 'cases');
  const expectedFindings = JSON.parse(
    fs.readFileSync(path.join(casesDir, 'expected-findings.json'), 'utf8')
  );

  let totalExpected = 0;
  let totalDetected = 0;
  let totalMatched = 0;

  for (const [filename, expected] of Object.entries(expectedFindings) as [string, any][]) {
    const filePath = path.join(casesDir, filename);
    const code = fs.readFileSync(filePath, 'utf8');

    console.log(`Evaluating [${expected.critic.toUpperCase()}]: ${filename}`);

    let result;
    if (expected.critic === 'ui') {
      result = await handleCritiqueUI({ code, filePath }, rulesEngine, llmClient);
    } else {
      result = await handleCritiqueBackend({ code, filePath, isWorkflowJson: filename.endsWith('.json') }, rulesEngine, llmClient);
    }

    const detectedRuleIds = result.findings.map(f => f.ruleId);
    const expectedRuleIds: string[] = expected.expectedRules;

    const matchedRules = expectedRuleIds.filter(r => detectedRuleIds.includes(r));
    const recall = (matchedRules.length / expectedRuleIds.length) * 100;

    totalExpected += expectedRuleIds.length;
    totalDetected += detectedRuleIds.length;
    totalMatched += matchedRules.length;

    console.log(`  - Quality Score: ${result.score}/100 (Passed: ${result.passed})`);
    console.log(`  - Detected Rules (${detectedRuleIds.length}): ${detectedRuleIds.join(', ')}`);
    console.log(`  - Expected Rules (${expectedRuleIds.length}): ${expectedRuleIds.join(', ')}`);
    console.log(`  - Recall: ${recall.toFixed(1)}%\n`);
  }

  const overallRecall = (totalMatched / totalExpected) * 100;
  const overallPrecision = (totalMatched / totalDetected) * 100;

  console.log('-----------------------------------------------------');
  console.log('                  FINAL BENCHMARK SCORE              ');
  console.log('-----------------------------------------------------');
  console.log(`Total Expected Flaws: ${totalExpected}`);
  console.log(`Total Flaws Detected: ${totalDetected}`);
  console.log(`Total Matched:        ${totalMatched}`);
  console.log(`Overall Recall:       ${overallRecall.toFixed(1)}%`);
  console.log(`Overall Precision:    ${overallPrecision.toFixed(1)}%`);
  console.log('=====================================================\n');

  if (overallRecall < 80) {
    console.error('Benchmark failed: Recall below 80% threshold.');
    process.exit(1);
  }
}

runBenchmarks().catch(err => {
  console.error('Error running benchmarks:', err);
  process.exit(1);
});
