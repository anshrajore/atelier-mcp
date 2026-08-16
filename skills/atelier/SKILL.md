---
name: atelier
description: Two-agent post-generation quality gate for vibe-coded applications. Deterministic, gradeable ruleset enforcing UI/UX design-system craft and backend architectural soundness.
version: 2.0.0
author: Ansh Rajore
license: MIT
---

# Atelier Canonical Ruleset (Base)

Atelier Base defines universal, gradeable quality gate rules that apply across any stack. Every rule contains an absolute pass/fail threshold and a mechanical `check:` specification for automated evaluation without subjective interpretation.

---

## 1. Universal UI/UX Rules (`BASE-UI-xxx`)

### `BASE-UI-101: Harmonic Spacing System Discipline`
- **Statement**: All layout margins, paddings, and container gaps must strictly conform to an 8px harmonic grid (subgrid: 4px).
- **Threshold**: Zero occurrences of spacing values outside `[0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]px`.
- **Violation Example**: `margin-top: 13px;` or `padding: 7px 19px;` or `p-[17px]`.
- **check:** `regex: (?:(?:margin|padding|gap|top|bottom|left|right)(?:-(?:top|bottom|left|right|x|y))?\s*:\s*(\d+)px|(?:m|p|gap)-?\[(\d+)px\]) -> extract integer $1 or $2 -> fail if num % 4 != 0 or num not in [0,4,8,12,16,24,32,48,64,96,128]`

---

### `BASE-UI-102: Strict Typographic Scale & Optical Tracking`
- **Statement**: Font sizes must derive from a standardized modular scale, with negative tracking on display text (>=24px) and wide tracking on micro-labels (<=12px uppercase).
- **Threshold**: Font size values must belong to `{12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72}px`. Display headers (>=24px) must have `letter-spacing <= -0.015em`.
- **Violation Example**: `font-size: 29px;` or `font-size: 36px; letter-spacing: normal;`.
- **check:** `ast: CSS/JSX TextStyleNode -> where fontSize >= 24px and letterSpacing not in ['-0.02em', '-0.025em', '-0.03em', '-0.04em', 'tracking-tight', 'tracking-tighter'] -> fail`

---

### `BASE-UI-103: WCAG 2.1 AA Contrast Minimum`
- **Statement**: Body text and interactive icons must maintain a minimum contrast ratio of 4.5:1 against their rendered background (3.0:1 for text >= 24px).
- **Threshold**: Calculated relative luminance contrast ratio `< 4.5:1` for regular text (<24px) or `< 3.0:1` for large text (>=24px) is a hard failure.
- **Violation Example**: Text `#94a3b8` (Slate-400) on white `#ffffff` background (contrast ratio: 2.45:1).
- **check:** `metric: contrast_ratio(foreground_color, background_color) -> fail if (is_large_text ? ratio < 3.0 : ratio < 4.5)`

---

### `BASE-UI-104: Single Primary Visual Focal Point`
- **Statement**: A single screen or viewport state must contain exactly one primary high-emphasis call-to-action (CTA) or focal headline.
- **Threshold**: Maximum of 1 element per viewport matching primary CTA button tokens (`btn-primary`, `bg-primary`, `variant="default"`).
- **Violation Example**: A hero section containing two adjacent solid high-contrast primary buttons.
- **check:** `ast: count_nodes(type === 'Button' and variant === 'primary' and container === 'Hero') -> fail if count > 1`

---

### `BASE-UI-105: Decorative Element Hard Ceiling`
- **Statement**: Visual surfaces must enforce a hard ceiling on decorative elements (gradients, drop shadows, decorative animations) per view to eliminate visual clutter.
- **Threshold**: Maximum 1 CSS box-shadow variant per component, maximum 1 text gradient clip per view, and maximum 0 continuous looping decorative animations (`animate-pulse`/`animate-ping` on non-status elements).
- **Violation Example**: A card with glowing colored drop-shadow, rainbow gradient headline, and a pulsing biscuit pill badge.
- **check:** `ast: count_occurrences(class.includes('animate-pulse') and !has_aria_live) + count_occurrences(class.includes('bg-clip-text')) -> fail if total > 1`

---

## 2. Universal Backend Architecture Rules (`BASE-BE-xxx`)

### `BASE-BE-201: Zero Hardcoded Secrets & Fail-Fast Boot Config`
- **Statement**: Source code and configuration files must contain zero plaintext credentials, API tokens, or fallback defaults.
- **Threshold**: Zero occurrences of literal credential assignments or fallback operators on secret environment keys.
- **Violation Example**: `const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_dev";`
- **check:** `regex: (?:JWT_SECRET|API_KEY|SECRET_KEY|DATABASE_URL|PASSWORD|PRIVATE_KEY)\s*(?:=|:|\?\?|\|\|)\s*['"][a-zA-Z0-9_\-]{8,}['"] -> fail if match found`

---

### `BASE-BE-202: Strict Boundary Schema Validation`
- **Statement**: All external input boundaries (HTTP request body, query parameters, URL path parameters, webhook payloads) must parse through a typed schema validator before business logic execution.
- **Threshold**: Direct unchecked indexing into `req.body`, `request.json()`, `request.args`, or `event.body` without schema validation (`.parse()`, `validate()`, `z.object()`, `BaseModel`) is a hard failure.
- **Violation Example**: `const { email, password } = req.body; await db.users.create({ email, password });`
- **check:** `ast: FunctionDeclaration(endpoint_handler) -> inspect params -> if accesses(req.body) and !calls_validator(schema.parse | schema.validate) -> fail`

---

### `BASE-BE-203: Sanitized Deterministic Error Propagation`
- **Statement**: Application error handlers must map exceptions to standard HTTP error codes and must never expose internal system stack traces, database schema details, or raw driver errors to clients.
- **Threshold**: Zero occurrences of raw `err.stack`, `err.message` (from DB drivers), or unhandled `catch (err) { res.status(500).json(err); }`.
- **Violation Example**: `res.status(500).json({ error: err.stack, query: err.sql });`
- **check:** `ast: CatchClause -> if response.body contains err.stack or err.sql or err.driver -> fail`

---

### `BASE-BE-204: Zero Orphan / Disconnected Execution Paths`
- **Statement**: Every branching condition, pipeline node, and asynchronous promise must resolve to an explicit terminal response, error handler, or dead-letter logger.
- **Threshold**: Zero empty catch blocks, unhandled promise rejections, or disconnected workflow nodes.
- **Violation Example**: `try { await notifyService(); } catch (e) {}`
- **check:** `ast: CatchClause -> if body.statements.length === 0 or body.statements == [console.log(e)] -> fail`

---

### `BASE-BE-205: Mandatory Rate Limiting & Timeout Defaults`
- **Statement**: All public entry points and outgoing third-party network requests must define explicit timeout caps and rate limiting middleware.
- **Threshold**: Outgoing HTTP fetch/axios/requests calls must specify `timeout <= 15000ms`. Public authentication endpoints must attach rate limiters.
- **Violation Example**: `const res = await fetch("https://api.external.com/data"); // No timeout specified`
- **check:** `ast: CallExpression(name in ['fetch', 'axios.get', 'axios.post', 'http.request']) -> if !has_property('timeout') and !has_property('signal') -> fail`
