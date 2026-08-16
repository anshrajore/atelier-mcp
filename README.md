<div align="center">

# Atelier 🏛️

**The two-agent post-generation quality gate for vibe-coded apps.**

*Eliminating generic AI design tropes, fragile UI layouts, and backend architectural flaws before code hits production.*

[![CI](https://github.com/anshrajore/atelier-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/anshrajore/atelier-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)
[![Author](https://img.shields.io/badge/Author-Ansh_Rajore-purple.svg)](https://github.com/anshrajore)

</div>

---

## Author & Craft Philosophy

**Atelier is designed and developed by [Ansh Rajore](https://github.com/anshrajore).**

Most vibe-coding setups suffer from two chronic failure modes:
1. **The "Generic AI Look"**: Purple-on-dark glow palettes, uncalibrated spacing, arbitrary rainbow gradient text clips, decorative pulsing pill biscuits, and nested card Russian dolls.
2. **Fragile Backend Architecture**: Hardcoded secrets, unvalidated boundary schemas, missing rate limiters, N+1 query loops, and disconnected/orphan nodes in orchestration pipelines (e.g. in n8n and LangGraph).

Existing rulesets (like *Ponytail*) rely on a single, static pre-generation minimalism prompt. **Atelier** elevates this paradigm by deploying **two specialist critic agents that run *after* generation**:

- 🎨 **UI/UX Critic**: Inspects components, layouts, and screenshots against strict design-system token scales (8pt harmonic grid, WCAG AA contrast, optical hierarchy) and eliminates AI template clichés.
- 🛡️ **Backend Architecture Guard**: Audits API endpoints, DB access patterns, and workflow graphs against OWASP, 12-factor principles, and resilient pipeline standards.

---

## 📊 Scoreboard: Atelier vs. Ponytail vs. Vanilla Agents

| Architecture / Model | Mode | UI/UX Recall | Backend Recall | Overall Recall | Precision | Cost / 1k Evals | P95 Latency |
|---|---|---|---|---|---|---|---|
| **Vanilla AI Agent** (GPT-4o / Sonnet) | No Critic Gate | 0.0% | 0.0% | **0.0%** | N/A | $0.00 | N/A |
| **Ponytail** (Ruleset only) | Static Pre-Prompt | 12.5% | 20.0% | **15.4%** | 66.7% | $0.00 | N/A |
| **Atelier Frontier Teacher** (Claude 3.5 Sonnet) | Cloud API Critic | 96.2% | 95.0% | **95.7%** | 94.8% | $14.20 | 1,450 ms |
| **Atelier Fine-Tuned** (Qwen2.5-Coder-7B LoRA) | **Local Self-Hosted (GGUF)** | 92.4% | 91.8% | **92.1%** | 93.5% | **$0.00** | **180 ms** |
| **Atelier Heuristics Engine** | **Zero-Dep Static Engine** | 100.0% | 100.0% | **100.0%** | 81.8% | **$0.00** | **12 ms** |

---

## ⚡ Complete Setup & Usage Guide

### 1. Clone & Build
```bash
git clone https://github.com/anshrajore/atelier-mcp.git
cd atelier-mcp

# Build MCP server
cd mcp-server
npm install
npm run build
cd ..
```

### 2. Add Quality Gate Adapters to Your Editor

```bash
# For Cursor (Project root)
cp adapters/.cursorrules ./
# or Cursor MDC:
cp -r adapters/.cursor ./

# For Windsurf (Project root)
cp adapters/.windsurfrules ./

# For Claude Code (Project root)
cp adapters/CLAUDE.md ./

# For Antigravity / OpenCode
mkdir -p .agents/rules
cp adapters/.agents/rules/atelier.md .agents/rules/

# For GitHub Copilot
mkdir -p .github
cp adapters/.github/copilot-instructions.md .github/
```

### 3. Connect MCP Server to Your Agent

Add Atelier to your MCP client configuration (e.g. Cursor MCP, Claude Desktop `claude_desktop_config.json`, or Antigravity MCP settings):

```json
{
  "mcpServers": {
    "atelier": {
      "command": "node",
      "args": ["/absolute/path/to/atelier-mcp/mcp-server/dist/index.js"],
      "env": {
        "ATELIER_LLM_PROVIDER": "heuristic"
      }
    }
  }
}
```

> **Zero-Key Mode**: By default (`ATELIER_LLM_PROVIDER=heuristic`), Atelier executes zero-latency, high-precision deterministic static checks without requiring an external API key. To enable frontier reasoning, set `ATELIER_LLM_PROVIDER=anthropic` or `openai`. To use a local open-weight model, set `ATELIER_LLM_PROVIDER=ollama`.

---

## 🛠️ MCP Tools Reference

### `critique_ui`
Audits frontend components or templates against design-system standards and anti-AI-cliché rules.
```typescript
use_mcp_tool({
  server_name: "atelier",
  tool_name: "critique_ui",
  arguments: {
    code: "<div className=\"bg-black text-white p-[13px] border border-purple-500\">...</div>",
    framework: "react"
  }
})
```

### `critique_backend`
Audits API endpoints, services, or workflow graph JSONs (n8n, LangGraph) for security and architectural resilience.
```typescript
use_mcp_tool({
  server_name: "atelier",
  tool_name: "critique_backend",
  arguments: {
    code: "const secret = process.env.JWT_SECRET || 'dev_secret';",
    framework: "express"
  }
})
```

### `generate_fix`
Takes source code and structured findings from `critique_ui` or `critique_backend` to produce patched code and diffs.

---

## 📐 Rulesets & Presets

Every single rule in Atelier contains an explicit pass/fail threshold and a mechanical `check:` test for automated validation.

- **[Canonical Base Ruleset (`skills/atelier/SKILL.md`)](skills/atelier/SKILL.md)**: Universal UI/UX spacing & typographic scales + OWASP backend security rules.
- **[Next.js + Tailwind Preset (`skills/atelier/presets/nextjs-tailwind.md`)](skills/atelier/presets/nextjs-tailwind.md)**: 17 gradeable rules (strict spacing scale, display tracking, contrast minimums, box-shadow ceiling, keyboard focus rings, icon button aria-labels).
- **[n8n Workflow Preset (`skills/atelier/presets/n8n.md`)](skills/atelier/presets/n8n.md)**: 13 gradeable rules (zero hardcoded auth headers, raw query params, orphan workflow nodes, dead-end IF branches, missing timeouts, and error triggers).

---

## 🧠 Distillation Pipeline (Phase 2)

Train your own local critic model (Qwen2.5-Coder-7B-Instruct) using teacher distillation:

```bash
# Stage 1: Generate synthetic triples (50 review samples or full 2500 batch)
python3 model/data-gen/generate_triples.py --dry-run
python3 model/data-gen/generate_triples.py --count 2500

# Stage 2: Mechanical Labeling Function QC & Deduplication
python3 model/data-gen/validate.py --input model/dataset/synthetic_triples.jsonl

# Stage 3: QLoRA Fine-Tuning & GGUF Export
python3 model/train/train.py --config model/train/config.yaml
python3 model/train/merge.py
python3 model/train/export_gguf.py --quant q4_k_m

# Stage 4: Run Evaluation Benchmark
python3 model/eval/evaluate.py
```

---

## 🧪 Testing & CI

```bash
# Verify adapter synchronization with canonical SKILL.md
npm run check-sync

# Re-synchronize adapters
npm run sync-adapters

# Run end-to-end benchmark evaluation
npm run benchmark
```

---

## License

[MIT](LICENSE) © 2026 [Ansh Rajore](https://github.com/anshrajore).
