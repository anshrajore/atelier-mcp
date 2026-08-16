# Atelier Quality Gate Adapter for AGENTS.md
# GENERATED FROM skills/atelier/SKILL.md — DO NOT EDIT DIRECTLY.
# Run `npm run sync-adapters` to update.

You must strictly obey the Atelier post-generation quality gate rules for all code generation:

## UI/UX CRITIC RULES
- UI-101: Use a strict 4px / 8px harmonic spacing scale (e.g., `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px` or Tailwind spacing tokens `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`).
- UI-102: Layout containers must gracefully wrap, flex, or scroll without horizontal page overflow (`overflow-x: hidden` as a band-aid is prohibited).
- UI-103: Maintain a clear visual hierarchy with distinct font sizes and calibrated letter-spacing (`letter-spacing` / tracking). Large headlines (>24px) MUST have tighter tracking (`-0.02em` to `-0.04em`), while uppercase badges/labels (<12px) MUST have wider tracking (`+0.05em`).
- UI-104: Body text columns must be constrained to 45–75 characters per line (approx `max-w-prose` / `65ch`) for optimal readability.
- UI-105: Reject the default "purple/indigo glow on pitch-black background" pattern unless explicitly dictated by brand guidelines.
- UI-106: Reject redundant biscuit/pill badges with a pulsing dot placed directly above the main `<h1>` ("✨ Announcing 2.0 ✨") unless it serves real-time status indication.
- UI-107: Avoid multi-color text gradients (`bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent`) applied arbitrarily across headline words.
- UI-108: Maximum card nesting depth is 1. Avoid placing cards inside cards inside cards with redundant borders and drop shadows.
- UI-109: Text and interactive icons must meet minimum 4.5:1 contrast ratio against their background (3:1 for large text >= 18.5px bold or 24px regular).
- UI-110: Every clickable, focusable element (buttons, links, inputs) MUST have explicit styles for `:hover`, `:focus-visible` (focus rings), `:active`, and `disabled` (with `aria-disabled`).

## BACKEND ARCHITECTURE GUARD RULES
- BE-201: Never commit, hardcode, or fallback-default API keys, tokens, JWT secrets, or DB passwords. Environment variables must be validated at boot time (e.g., with Zod, Envalid, Pydantic).
- BE-202: All external inputs (request body, query parameters, URL params, webhook payloads, LLM outputs) must be strictly validated against a typed schema before execution.
- BE-203: All publicly accessible, unauthenticated, authentication-related, or AI-inference endpoints must be guarded with rate limiters (e.g., Redis Token Bucket, express-rate-limit, slowapi).
- BE-204: Batch or join related entity fetches. Never perform database queries inside iterations (`for`, `map`, `forEach`).
- BE-205: Every collection query must specify deterministic sorting and hard limits on pagination (`limit` / `take` capped at a safe maximum like 100).
- BE-206: In workflow orchestrators (n8n, LangChain, LangGraph, Temporal, step functions), all conditional branches and error paths must connect to explicit terminal or recovery handlers.
- BE-207: State-mutating operations (payments, webhooks, order placement) must support idempotency keys. All internal exceptions must map to standard HTTP status codes without leaking stack traces.
