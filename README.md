<div align="center">

# Atelier 🏛️

**The two-agent post-generation quality gate for vibe-coded apps.**

*Eliminating generic AI design tropes, fragile UI layouts, and backend architectural flaws before code hits production.*

[![CI](https://github.com/atelier-dev/atelier/actions/workflows/ci.yml/badge.svg)](https://github.com/atelier-dev/atelier/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-green.svg)](https://modelcontextprotocol.io)

</div>

---

## Why Atelier?

Most vibe-coding workflows suffer from two chronic failure modes:
1. **The "Generic AI Look"**: Purple-on-dark glow palettes, uncalibrated spacing, arbitrary rainbow gradient text clips, decorative pulsing pill biscuits, and nested card Russian dolls.
2. **Fragile Backend Architecture**: Hardcoded secrets, unvalidated boundary schemas, missing rate limiters, N+1 query loops, and disconnected/orphan nodes in orchestration pipelines.

Existing rule repositories (like *Ponytail*) rely on a single, static pre-generation minimalism prompt. **Atelier** elevates this paradigm by deploying **two specialist critic agents that run *after* generation**:

- 🎨 **UI/UX Critic**: Inspects components, layouts, and screenshots against strict design-system token scales (8pt harmonic grid, WCAG AA contrast, optical hierarchy) and eliminates AI template clichés.
- 🛡️ **Backend Architecture Guard**: Audits API endpoints, DB access patterns, and workflow graphs against OWASP, 12-factor principles, and resilient pipeline standards.

---

## Atelier vs. Ponytail vs. Vanilla Agents

| Capability | Vanilla AI Agents | Ponytail | **Atelier** |
|---|---|---|---|
| **Paradigm** | Unconstrained generation | Static pre-prompt rules | **Two-agent post-generation quality gate** |
| **UI/UX Design Craft** | ❌ Defaults to generic AI templates | ❌ Ignores design systems | **✅ Strict 8pt grid, WCAG AA, anti-cliché heuristics** |
| **Backend & Pipeline Soundness** | ❌ Hardcoded keys, N+1 queries | ❌ Code minimalism only | **✅ OWASP, boundary validation, orphan node audit** |
| **Multi-Modal Inspection** | ❌ Text only | ❌ Text only | **✅ Code + rendered screenshot vision audit** |
| **Model Distillation / Local Execution** | ❌ Cloud only | ❌ Prompt only (no model) | **✅ Distillation pipeline for local 7B/8B critic models** |
| **Distribution** | None | Multi-editor rules | **✅ MCP Server + Adapters (Cursor, Windsurf, Antigravity, Claude Code)** |

---

## Architecture

```
                                  [ AI Coding Agent ]
                                           │
                                           ▼ (Generated Code / Layout)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ATELIER MCP SERVER                                   │
│                                                                                        │
│   ┌──────────────────────────────────┐        ┌──────────────────────────────────┐   │
│   │           UI/UX Critic           │        │    Backend Architecture Guard    │   │
│   │  (Spacing, Contrast, Clichés)    │        │  (OWASP, N+1, Validation, Flow)  │   │
│   └─────────────────┬────────────────┘        └─────────────────┬────────────────┘   │
│                     │                                           │                      │
│                     ▼                                           ▼                      │
│   ┌──────────────────────────────────────────────────────────────────────────────┐   │
│   │                         Grounded Knowledge Corpus                            │   │
│   │        (/corpus/design-systems, /corpus/backend-best-practices)              │   │
│   └──────────────────────────────────────────────────────────────────────────────┘   │
│                                           │                                            │
│                                           ▼                                            │
│                       Structured Findings & Concrete Diffs                            │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
                               [ Verified Production Code ]
```

---

## Quickstart & Installation

### 1. Drop into Your AI Editor

Copy or symlink the adapter for your favorite environment:

```bash
# Cursor
cp adapters/.cursorrules ./
# or Cursor MDC:
cp -r adapters/.cursor ./

# Windsurf
cp adapters/.windsurfrules ./

# Claude Code
cp adapters/CLAUDE.md ./

# Antigravity / OpenCode
mkdir -p .agents/rules
cp adapters/.agents/rules/atelier.md .agents/rules/

# GitHub Copilot
mkdir -p .github
cp adapters/.github/copilot-instructions.md .github/
```

### 2. Configure the MCP Server

Add Atelier to your MCP configuration (e.g. `claude_desktop_config.json`, Cursor MCP settings, or Antigravity MCP settings):

```json
{
  "mcpServers": {
    "atelier": {
      "command": "node",
      "args": ["/path/to/atelier/mcp-server/dist/index.js"],
      "env": {
        "ATELIER_LLM_PROVIDER": "heuristic"
      }
    }
  }
}
```

> **Zero-Key Mode**: By default (`ATELIER_LLM_PROVIDER=heuristic`), Atelier executes zero-latency, high-precision deterministic static checks without requiring an external API key. To enable frontier reasoning, set `ATELIER_LLM_PROVIDER=anthropic` or `openai`.

---

## Exposed MCP Tools

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

## Ruleset Overview

### UI/UX Rules (`UI-1xx`)
- **`UI-101: Harmonic Spacing Scale`**: Strict 4px/8px grid. Rejects ad-hoc margins (`p-[13px]`).
- **`UI-102: Fluid Responsive Boundaries`**: No fixed-width mobile breakpoints.
- **`UI-103: Strict Type Scale & Tracking`**: Tighter tracking on headlines (`-0.02em`), wide tracking on badges.
- **`UI-104: Optical Balance & Line Length`**: Constrained prose columns (45–75 chars / `65ch`).
- **`UI-105: Forbidden Purple on Dark`**: Eliminates stereotypical purple glow on black templates.
- **`UI-106: Forbidden Pulsing Headline Pills`**: Removes decorative pulsing biscuit badges.
- **`UI-107: Forbidden Gradient Keywords`**: Rejects rainbow gradient text clips on headline copy.
- **`UI-108: Forbidden Over-Nested Cards`**: Maximum card nesting depth of 1.
- **`UI-109: WCAG 2.1 AA Contrast Compliance`**: 4.5:1 minimum text contrast ratio.
- **`UI-110: Complete Interactive State Matrix`**: Explicit hover, focus-visible, and disabled states.

### Backend Rules (`BE-2xx`)
- **`BE-201: Zero Hardcoded Secrets`**: Fail-fast boot schema validation (Zod/Pydantic).
- **`BE-202: Strict Boundary Schema Validation`**: Type-checked input parsing on all request bodies.
- **`BE-203: Mandatory Public Throttling`**: Rate limiting on public, auth, and AI endpoints.
- **`BE-204: Elimination of N+1 Queries`**: Batched joins on database relationships.
- **`BE-205: Unbounded Query Protection`**: Capped pagination limits on collection queries.
- **`BE-206: Zero Orphan / Disconnected Nodes`**: Complete graph route validation in orchestrations (n8n/LangGraph).
- **`BE-207: Idempotency & Error Sanitization`**: Safe mutations and sanitized error codes.

---

## Benchmark Results

Evaluated against the synthetic anti-pattern test suite in `/benchmarks`:

| Category | Test Case | Target Flaws | Detected | Recall | Score |
|---|---|---|---|---|---|
| **UI/UX** | `ui-generic-dashboard.tsx` | 5 | 5 | 100% | 55/100 (FAIL) |
| **Backend** | `backend-vulnerable-api.ts` | 3 | 3 | 100% | 25/100 (FAIL) |
| **Workflow** | `pipeline-orphan-workflow.json` | 1 | 1 | 100% | 75/100 (FAIL) |
| **Overall** | **Combined Suite** | **9** | **9** | **100%** | **0 False Positives** |

To run the benchmark suite locally:
```bash
npm run benchmark
```

---

## Development & CI

```bash
# Verify adapter synchronization with canonical SKILL.md
npm run check-sync

# Re-synchronize adapters after modifying SKILL.md
npm run sync-adapters

# Build MCP Server
npm run build
```

---

## License

[MIT](LICENSE) © 2026 Atelier Authors
