const { RulesEngine } = require('../mcp-server/dist/rules-engine.js');
const { LLMClient } = require('../mcp-server/dist/llm-client.js');
const { handleCritiqueUI } = require('../mcp-server/dist/critics/ui.js');
const { handleCritiqueBackend } = require('../mcp-server/dist/critics/backend.js');
const { handleGenerateFix } = require('../mcp-server/dist/critics/fixer.js');

async function testAll() {
  const rulesEngine = new RulesEngine();
  const llmClient = new LLMClient({ provider: 'heuristic' });

  console.log('Testing critique_ui...');
  const uiCode = '<div className="bg-black text-white p-[17px] border border-purple-500"><button>Click</button></div>';
  const uiRes = await handleCritiqueUI({ code: uiCode }, rulesEngine, llmClient);
  console.log(`UI Score: ${uiRes.score}, Findings: ${uiRes.findings.length}`);
  if (uiRes.findings.length === 0) throw new Error('UI findings expected');

  console.log('\nTesting generate_fix on UI findings...');
  const fixRes = handleGenerateFix({ code: uiCode, critic: 'ui', findings: uiRes.findings });
  console.log('Fixed Code:\n', fixRes.fixedCode);
  console.log('Resolved Rules:', fixRes.resolvedRules);

  console.log('\nTesting critique_backend...');
  const beCode = 'const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";\napp.post("/login", (req, res) => { const user = req.body.user; });';
  const beRes = await handleCritiqueBackend({ code: beCode }, rulesEngine, llmClient);
  console.log(`Backend Score: ${beRes.score}, Findings: ${beRes.findings.length}`);
  if (beRes.findings.length === 0) throw new Error('Backend findings expected');

  console.log('\n✓ All MCP tools validated successfully!');
}

testAll().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
