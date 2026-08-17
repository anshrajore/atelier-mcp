<div align="center">

<img src="assets/atelier-banner.svg" alt="Atelier MCP Header Banner" width="100%" />

<br />
<br />

[![CI](https://github.com/anshrajore/atelier-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/anshrajore/atelier-mcp/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-00e5ff.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-00b4d8.svg)](https://modelcontextprotocol.io)
[![Author](https://img.shields.io/badge/Author-Ansh_Rajore-78909c.svg)](https://github.com/anshrajore)

</div>

---

## 🏛️ What is Atelier?

**Atelier is an open-source agent-skill and MCP server pack that adds a two-agent post-generation quality gate to vibe-coding workflows.**

Most AI-generated code suffers from two major failure modes:
1. **The "Generic AI Look"**: Arbitrary purple-on-dark glow palettes, uncalibrated spacing, rainbow gradient text fills, decorative pulsing pill badges, and nested Russian-doll cards.
2. **Fragile Backend Architecture**: Hardcoded secrets, unvalidated boundary schemas, missing rate limiters, N+1 query loops, and disconnected/orphan nodes in orchestration pipelines (n8n, LangGraph).

### How Atelier Differs from Ponytail

| Dimension | Ponytail | Atelier |
|---|---|---|
| **Gate Timing** | Pre-generation prompt injection only | **Post-generation inspection & repair gate** |
| **Domain Coverage** | Code minimalism & YAGNI only | **UI/UX Design Systems + Backend Architecture** |
| **Rule Verification** | Subjective / heuristic phrasing | **100% mechanically gradeable (`check:` field)** |
| **Shipped Model** | Zero model (static prompt only) | **Fine-tuned open-weight model + GGUF + API fallback** |
| **Tool Integration** | Static rule file copies | **Live MCP server (`critique_ui`, `critique_backend`)** |

---

## 📐 Architecture & Pipeline Flow

<div align="center">
  <img src="assets/architecture-diagram.svg" alt="Atelier Two-Critic Pipeline Flow" width="100%" />
</div>

1. **Generation**: Your vibe-coding editor (Cursor, Windsurf, Claude Code, Antigravity, GitHub Copilot) writes initial code.
2. **Atelier Gate**: The MCP server triggers two specialist critics:
   - **UI/UX Critic**: Audits typography scales, 8px spacing matrix, WCAG AA contrast, optical hierarchy, and decorative caps.
   - **Backend Guard**: Audits OWASP secrets leaks, boundary schema validation (Zod/Pydantic), error sanitization, and orphan pipeline paths.
3. **Structured Patch**: Emits deterministic score receipts, precise rule citations (`BASE-UI-101`, `BASE-BE-102`), and ready-to-apply diffs.

---

## 📊 Scoreboard & Benchmark Results

<div align="center">
  <img src="assets/scoreboard-chart.svg" alt="Atelier Benchmark Scoreboard" width="100%" />
</div>

### Detailed Performance Breakdown

| Architecture / Model | Mode | UI/UX Recall | Backend Recall | Overall Recall | Precision | Cost / 1k Evals | P95 Latency |
|---|---|---|---|---|---|---|---|
| **Vanilla AI Agent** (GPT-4o / Sonnet) | No Critic Gate | 0.0% | 0.0% | **0.0%** | N/A | $0.00 | N/A |
| **Ponytail** (Ruleset only) | Static Pre-Prompt | 12.5% | 20.0% | **15.4%** | 66.7% | $0.00 | N/A |
| **Atelier Frontier Teacher** (Claude 3.5 Sonnet) | Cloud API Critic | 96.2% | 95.0% | **95.7%** | 94.8% | $14.20 | 1,450 ms |
| **Atelier Fine-Tuned** (Qwen2.5-Coder-7B LoRA) | **Local Self-Hosted (GGUF)** | 92.4% | 91.8% | **92.1%** | 93.5% | **$0.00** | **180 ms** |
| **Atelier Heuristics Engine** | **Zero-Dep Static Engine** | 100.0% | 100.0% | **100.0%** | 81.8% | **$0.00** | **12 ms** |

---

## ⚡ Quickstart

### 1. Installation & Build

```bash
git clone https://github.com/anshrajore/atelier-mcp.git
cd atelier-mcp

# Build MCP server
npm install
npm run build
```

### 2. Connect to Your MCP Client

Add Atelier to your MCP configuration (Cursor MCP, Claude Desktop `claude_desktop_config.json`, or Antigravity):

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

#### Provider Options:
- `ATELIER_LLM_PROVIDER=heuristic` (Default): Fast, zero-dependency deterministic engine (0 USD, 12ms).
- `ATELIER_LLM_PROVIDER=ollama` / `vllm`: Local self-hosted fine-tuned model (0 USD, 180ms).
- `ATELIER_LLM_PROVIDER=anthropic` / `openai`: Frontier teacher API fallback.

### 3. Install Editor Adapters

Copy the adapter rules into your workspace:

```bash
# For Cursor (.cursorrules & .cursor/rules/)
cp adapters/.cursorrules ./
cp -r adapters/.cursor ./

# For Windsurf (.windsurfrules)
cp adapters/.windsurfrules ./

# For Claude Code (CLAUDE.md)
cp adapters/CLAUDE.md ./

# For Antigravity / OpenCode
mkdir -p .agents/rules
cp adapters/.agents/rules/atelier.md .agents/rules/

# For GitHub Copilot
mkdir -p .github
cp adapters/.github/copilot-instructions.md .github/
```

Verify all adapters are in sync with canonical rules:
```bash
npm run check-sync
```

---

## 📂 Repository Structure

```
atelier/
├── docs/
│   └── PROJECT_MAP.md             # Canonical architecture specification
├── skills/
│   └── atelier/
│       ├── SKILL.md               # Universal principles & mechanical checks
│       └── presets/
│           ├── nextjs-tailwind.md # Next.js & Tailwind CSS rules
│           └── n8n.md             # n8n workflow graph rules
├── mcp-server/                    # MCP server exposing critique_ui & critique_backend
├── adapters/                      # Per-tool rule files (Cursor, Windsurf, Claude, etc.)
├── model/
│   ├── data-gen/                  # Distillation generator (generate_triples.py) & validator
│   ├── dataset/                   # Validated training triples (train, val, test)
│   ├── train/                     # Local (MLX) and Cloud (PyTorch/RunPod/Colab) training
│   ├── eval/                      # Evaluation harness & benchmark suite
│   └── RUN_LOG.md                 # Autonomous pipeline execution log
├── benchmarks/
│   └── SCOREBOARD.md              # Live benchmark report
├── assets/                        # SVG design banners & architecture diagrams
├── CONTRIBUTING.md                # Rule & preset contribution guide
├── LICENSE                        # MIT License
└── README.md                      # Documentation & quickstart
```

---

## 🤝 Contributing

We welcome contributions of new framework presets (e.g. Svelte, FastAPI, Flutter) and additional mechanical rules. See [CONTRIBUTING.md](CONTRIBUTING.md) for details on adding rules with valid `check:` labeling functions and regenerating training data.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details. Developed by [Ansh Rajore](https://github.com/anshrajore).
