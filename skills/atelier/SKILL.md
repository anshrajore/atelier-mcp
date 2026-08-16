---
name: atelier
description: Two-agent post-generation quality gate for vibe-coded apps. Evaluates UI/UX craft against design systems and audits backend code against OWASP, 12-factor, and resilient pipeline standards.
version: 1.0.0
author: Atelier Authors
license: MIT
---

# Atelier Quality Gate Specification

Atelier is an automated post-generation critic system for AI-assisted software development. Rather than acting as a loose pre-prompt, Atelier executes deterministic, post-generation evaluation passes to eliminate generic AI design tropes, fragile frontend layouts, backend vulnerabilities, and broken orchestration pipelines.

---

## 1. UI/UX Critic Ruleset (`UI-xxx`)

The UI/UX Critic audits generated frontend templates, components, and full-page layouts. It rejects superficial "AI template vibes" in favor of intentional, accessible, production-grade craft.

### 1.1 Layout, Spacing & Sizing
- **`UI-101: Harmonic Spacing Scale`**
  - **Requirement**: Use a strict 4px / 8px harmonic spacing scale (e.g., `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px` or Tailwind spacing tokens `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`).
  - **Violation**: Ad-hoc, arbitrary margins or paddings (e.g., `margin-top: 13px`, `padding: 7px 19px`).
  - **Fix**: Snap all dimensions to the nearest token on the 4px/8px grid.

- **`UI-102: Fluid & Responsive Boundary Constraints`**
  - **Requirement**: Layout containers must gracefully wrap, flex, or scroll without horizontal page overflow (`overflow-x: hidden` as a band-aid is prohibited).
  - **Violation**: Fixed pixel widths on main containers (e.g., `width: 1200px`) that cause mobile overflow.
  - **Fix**: Use fluid constraints (e.g., `max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8`, CSS clamp `clamp(1rem, 2.5vw, 2rem)`).

### 1.2 Typography & Hierarchy
- **`UI-103: Strict Type Scale & Tracking`**
  - **Requirement**: Maintain a clear visual hierarchy with distinct font sizes and calibrated letter-spacing (`letter-spacing` / tracking). Large headlines (>24px) MUST have tighter tracking (`-0.02em` to `-0.04em`), while uppercase badges/labels (<12px) MUST have wider tracking (`+0.05em`).
  - **Violation**: Huge untracked headline typography (`font-size: 48px; font-weight: 700;` with `letter-spacing: normal`) or low contrast subheads indistinguishable from body copy.
  - **Fix**: Apply deliberate tracking tokens (e.g., `tracking-tight` on display headers, `tracking-wide uppercase text-xs` on overline metadata).

- **`UI-104: Optical Balance & Line Length`**
  - **Requirement**: Body text columns must be constrained to 45–75 characters per line (approx `max-w-prose` / `65ch`) for optimal readability.
  - **Violation**: Full-width unbounded paragraphs spanning 1920px wide monitors.
  - **Fix**: Wrap text content in constrained reading containers (`max-w-prose` or `max-w-2xl`).

### 1.3 Anti-AI Cliché Patterns (Forbidden Tropes)
- **`UI-105: Forbidden Purple/Violet on Dark`**
  - **Requirement**: Reject the default "purple/indigo glow on pitch-black background" pattern unless explicitly dictated by brand guidelines.
  - **Violation**: Dark themes consisting solely of `#0b0b14` with `#8b5cf6` glowing borders.
  - **Fix**: Adopt tailored, balanced palettes using neutral slates, zincs, warm grays, or deliberate brand accent tones with surface depth.

- **`UI-106: Forbidden Pulsing Headline Pills`**
  - **Requirement**: Reject redundant biscuit/pill badges with a pulsing dot placed directly above the main `<h1>` ("✨ Announcing 2.0 ✨") unless it serves real-time status indication.
  - **Violation**: Decorative, unclickable pulsing pill badges serving purely as headline decoration.
  - **Fix**: Remove the biscuit or convert it into a meaningful contextual breadcrumb or actionable tag.

- **`UI-107: Forbidden Gradient Keywords`**
  - **Requirement**: Avoid multi-color text gradients (`bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent`) applied arbitrarily across headline words.
  - **Violation**: Random gradient text highlights on marketing copy.
  - **Fix**: Use typographic weight, sizing, and purposeful single-color accenting for emphasis.

- **`UI-108: Forbidden Over-Nested Cards`**
  - **Requirement**: Maximum card nesting depth is 1. Avoid placing cards inside cards inside cards with redundant borders and drop shadows.
  - **Violation**: A rounded bordered card containing 3 smaller rounded cards, each containing another bordered tag card.
  - **Fix**: Flatten hierarchy using whitespace separation, subtle divider lines, or background contrast instead of infinite border boxes.

### 1.4 Accessibility, Contrast & Interaction States
- **`UI-109: WCAG 2.1 AA Contrast Compliance`**
  - **Requirement**: Text and interactive icons must meet minimum 4.5:1 contrast ratio against their background (3:1 for large text >= 18.5px bold or 24px regular).
  - **Violation**: Light gray text (`#9ca3af` / `#6b7280`) on white or dark gray text on black.
  - **Fix**: Elevate text color tokens to ensure sufficient contrast ratios across all theme modes.

- **`UI-110: Complete Interactive State Matrix`**
  - **Requirement**: Every clickable, focusable element (buttons, links, inputs) MUST have explicit styles for `:hover`, `:focus-visible` (focus rings), `:active`, and `disabled` (with `aria-disabled`).
  - **Violation**: Buttons with only static background color and no keyboard focus indicators or cursor hover feedback.
  - **Fix**: Provide complete state styling: `transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`.

---

## 2. Backend Architecture Guard Ruleset (`BE-xxx`)

The Backend Guard audits API endpoints, database interactions, middleware, configuration, and orchestration workflows (e.g., n8n, LangGraph, Temporal, Express, FastAPI).

### 2.1 Security & Secret Hygiene
- **`BE-201: Zero Hardcoded Secrets & Env Validation`**
  - **Requirement**: Never commit, hardcode, or fallback-default API keys, tokens, JWT secrets, or DB passwords. Environment variables must be validated at boot time (e.g., with Zod, Envalid, Pydantic).
  - **Violation**: `const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_dev"` or raw API keys embedded in code/workflow JSON nodes.
  - **Fix**: Extract to external environment configurations with fail-fast boot validation.

- **`BE-202: Strict Boundary Schema Validation`**
  - **Requirement**: All external inputs (request body, query parameters, URL params, webhook payloads, LLM outputs) must be strictly validated against a typed schema before execution.
  - **Violation**: Direct untyped usage of `req.body` or `request.json()` without validation.
  - **Fix**: Enforce schema parsers (Zod, Pydantic, Joi) that reject extra/malicious fields.

### 2.2 Rate Limiting & Resource Throttling
- **`BE-203: Mandatory Public Throttling`**
  - **Requirement**: All publicly accessible, unauthenticated, authentication-related, or AI-inference endpoints must be guarded with rate limiters (e.g., Redis Token Bucket, express-rate-limit, slowapi).
  - **Violation**: Login, registration, forgot-password, or heavy LLM endpoints without rate limiting middleware.
  - **Fix**: Attach rate limiting middleware with descriptive `429 Too Many Requests` responses and standard `Retry-After` headers.

### 2.3 Database Safety & Performance
- **`BE-204: Elimination of N+1 Queries`**
  - **Requirement**: Batch or join related entity fetches. Never perform database queries inside iterations (`for`, `map`, `forEach`).
  - **Violation**: Looping over an array of users and executing `SELECT * FROM posts WHERE user_id = ?` per item.
  - **Fix**: Use batching (`DataLoader`, `WHERE IN (...)`, Prisma `include`/`select`, SQLAlchemy `joinedload`).

- **`BE-205: Unbounded Query Protection & Safe Pagination`**
  - **Requirement**: Every collection query must specify deterministic sorting and hard limits on pagination (`limit` / `take` capped at a safe maximum like 100).
  - **Violation**: `db.users.findMany()` with no limit or cursor pagination.
  - **Fix**: Impose default and maximum limits with cursor/offset pagination.

### 2.4 Workflow & Pipeline Soundness
- **`BE-206: Zero Orphan / Disconnected Nodes`**
  - **Requirement**: In workflow orchestrators (n8n, LangChain, LangGraph, Temporal, step functions), all conditional branches and error paths must connect to explicit terminal or recovery handlers.
  - **Violation**: An `If / Else` condition or `Try / Catch` block where the error branch terminates without logging, notification, or fallback routing.
  - **Fix**: Wire all unlinked output connectors to dead-letter queues, recovery handlers, or structured error loggers.

- **`BE-207: Idempotency & Deterministic Error Propagation`**
  - **Requirement**: State-mutating operations (payments, webhooks, order placement) must support idempotency keys. All internal exceptions must map to standard HTTP status codes without leaking stack traces.
  - **Violation**: Retrying payment requests without idempotency headers, or returning raw internal database stack traces to clients in `500` error responses.
  - **Fix**: Enforce idempotency middleware and sanitize error responses via global exception filters.

---

## 3. Evaluation Output Contract

Every critique generated by an Atelier critic tool MUST conform to this schema:

```json
{
  "critic": "ui" | "backend",
  "score": 0-100,
  "passed": boolean,
  "findings": [
    {
      "ruleId": "UI-105" | "BE-201" | string,
      "severity": "critical" | "warning" | "suggestion",
      "title": "Short descriptive finding title",
      "location": {
        "file": "path/to/file.tsx",
        "line": 42
      },
      "explanation": "Why this violates the design or architectural standard.",
      "concreteFix": "Exact instructions or token change required.",
      "diff": "- old line\n+ new line"
    }
  ]
}
```
