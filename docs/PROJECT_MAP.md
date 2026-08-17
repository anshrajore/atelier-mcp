# Atelier: Project Specification & Architecture Map

> This document is the canonical master reference specification for the Atelier repository. It defines all components, rules, workflows, and acceptance criteria.

---

## 1. System Overview & Core Philosophy

**Atelier** is an open-source agent-skill and MCP server pack that plugs into vibe-coding environments (Cursor, Windsurf, Claude Code, Antigravity, GitHub Copilot). While existing tools (like *ponytail*) focus strictly on code minimalism and YAGNI rules before generation via static prompts, Atelier acts as a **two-agent post-generation quality gate**:

1. **UI/UX Critic**: Audits generated UI components and pages against design systems (spacing tokens, typography scale, WCAG contrast, focal hierarchy, decorative caps).
2. **Backend Architecture Guard**: Audits API routes, workflows, and server code for backend soundness (secrets leak prevention, input boundary validation, sanitized error reporting, no orphan logic branches, rate limits/timeouts).

Every rule is **mechanically gradeable** (pass/fail via regex, AST, or JSON schema). The repo ships a self-hostable fine-tuned model as the default critic, with frontier-API fallback.

---

## 2. Component Directory Structure

```
atelier/
├── docs/
│   └── PROJECT_MAP.md             # This canonical specification
├── skills/
│   └── atelier/
│       ├── SKILL.md               # Universal principles (UI/UX & Backend)
│       └── presets/
│           ├── nextjs-tailwind.md # Next.js + Tailwind CSS rules
│           └── n8n.md             # n8n workflow JSON rules
├── mcp-server/                    # MCP server exposing critique_ui & critique_backend
├── adapters/                      # Per-tool configurations (Cursor, Windsurf, Claude, Copilot, AGY)
├── model/
│   ├── data-gen/                  # Distillation dataset generator & validator
│   ├── dataset/                   # Generated & validated JSONL triples
│   ├── train/                     # Local (MLX) and Cloud (PyTorch/RunPod/Colab) fine-tuning
│   ├── eval/                      # Benchmarking & scoreboard evaluation
│   └── RUN_LOG.md                 # Autonomous execution & decision log
├── benchmarks/
│   └── SCOREBOARD.md              # Live precision/recall/cost/latency metrics
├── assets/                        # Design system SVG graphics (wordmark, architecture, scoreboard)
├── CONTRIBUTING.md                # Rule & preset contribution guidelines
├── LICENSE                        # MIT License
└── README.md                      # Public documentation and quickstart
```

---

## 3. Detailed Component Breakdown

### 3.1 Ruleset (`/skills/atelier`)
- **Base Rules (`SKILL.md`)**:
  - *UI/UX*: Typography scale discipline, 8px spacing grid, WCAG AA contrast, single focal point per screen, hard decorative ceiling.
  - *Backend*: Secrets handling (OWASP), boundary schema validation (Zod/Pydantic), error sanitization, orphan logic branch prevention, rate limits & timeouts.
- **Framework Presets (`presets/*.md`)**:
  - `nextjs-tailwind.md`: Arbitrary Tailwind values, responsive layout constraints, font loading, layout shifts.
  - `n8n.md`: Node connection schema, error-trigger nodes, credential expressions, retry policies.
- **The `check:` Field**: Every single rule MUST contain an unambiguous mechanical test (`check:`), which acts as the deterministic labeling function for dataset generation and validation.

### 3.2 Distillation Pipeline (`/model`)
- **Stage 1 (`generate_triples.py`)**: Generates synthetic (flawed input → critique → fixed output) triples for single-violation, compound-violation, and clean-negative cases.
- **Stage 2 (`validate.py`)**: Re-runs each rule's mechanical `check:` against inputs (must fail) and fixed outputs (must pass). Deduplicates and logs per-rule rejection rates.
- **Stage 3 (`train/`)**: Runs LoRA/QLoRA fine-tuning on small open-weight bases (MLX on Apple Silicon, PyTorch on CUDA).
- **Stage 4 (`eval/`)**: Benchmarks teacher vs. local model vs. baseline, generating `SCOREBOARD.md`.

### 3.3 MCP Server (`/mcp-server`)
- Exposes `critique_ui` and `critique_backend`.
- Emits structured JSON findings citing exact rule IDs with concrete diff suggestions.
- Routes inference to local fine-tuned model by default, falling back to frontier APIs gracefully.

### 3.4 Multi-Tool Adapters (`/adapters`)
- Adapters for Cursor (`.cursorrules`), Windsurf (`.windsurfrules`), Claude Code (`CLAUDE.md`), GitHub Copilot (`copilot-instructions.md`), and Antigravity.
- CI drift checker ensuring adapters never diverge from `SKILL.md`.

---

## 4. Release Criteria & Evaluation Gates
- Automated dataset validation pass rate $\ge 90\%$.
- Model adapter weights must be non-zero and verify loss convergence.
- Scoreboard must reflect actual benchmark evaluations across test repos.
