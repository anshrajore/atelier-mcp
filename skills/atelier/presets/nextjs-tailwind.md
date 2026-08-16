# Atelier Preset: Next.js + React + Tailwind CSS

This preset extends `SKILL.md` with deterministic, mechanically verifiable rules specifically tailored for Next.js (App Router / Pages Router), React components, and Tailwind CSS.

---

## 1. Typography & Hierarchy (`NEXT-UI-xxx`)

### `NEXT-UI-101: Fixed Tailwind Font-Size Tokens Only`
- **Statement**: Components must use standard Tailwind font-size utilities (`text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`). Arbitrary pixel sizing like `text-[17px]` is forbidden.
- **Pass/Fail Threshold**: Zero occurrences of `text-[\d+px]` or `text-[\d+rem]`.
- **Violation Example**: `<h2 className="text-[22px] font-bold">`
- **check:** `regex: text-\[\d+(?:px|rem)\] -> count matches -> fail if count > 0`

### `NEXT-UI-102: Minimum Body Text Size (>= 14px)`
- **Statement**: Paragraph and body text elements must never render smaller than `text-sm` (14px). `text-xs` (12px) is restricted to metadata overlines, badges, and timestamps.
- **Pass/Fail Threshold**: `<p>` tags and `<article>` bodies cannot contain `text-xs` or smaller.
- **Violation Example**: `<p className="text-xs text-gray-600 leading-relaxed">Long descriptive body paragraph...</p>`
- **check:** `ast: JSXElement(name === 'p') -> if classList.contains('text-xs') and !classList.contains('line-clamp-1') -> fail`

### `NEXT-UI-103: Display Header Tracking Calibration`
- **Statement**: Large typography (`text-3xl`, `text-4xl`, `text-5xl`, `text-6xl`) must declare negative letter spacing (`tracking-tight` or `tracking-tighter`).
- **Pass/Fail Threshold**: Elements with `text-3xl` or larger must contain `tracking-tight` or `tracking-tighter`.
- **Violation Example**: `<h1 className="text-5xl font-extrabold text-foreground">Hero Title</h1>`
- **check:** `ast: JSXElement(name in ['h1', 'h2']) -> if has_class(/text-[3-6]xl/) and !has_class(/tracking-tight(?:er)?/) -> fail`

### `NEXT-UI-104: Calibrated Line Height on Body Text`
- **Statement**: Multi-line body text elements must provide proportional leading (`leading-relaxed` or `leading-normal`). `leading-none` or `leading-tight` on body paragraphs is prohibited.
- **Pass/Fail Threshold**: `<p>` tags with text length > 60 chars must not have `leading-none` or `leading-3`/`leading-4`.
- **Violation Example**: `<p className="text-base leading-none">A long multi-line paragraph that will overlap and look terrible...</p>`
- **check:** `ast: JSXElement(name === 'p') -> if has_class('leading-none') or has_class('leading-tight') -> fail`

---

## 2. Spacing & Layout Discipline (`NEXT-UI-xxx`)

### `NEXT-UI-105: Strict Tailwind Harmonic Spacing Tokens`
- **Statement**: Margins, paddings, and flex/grid gaps must use standard 4px/8px Tailwind spacing scale tokens (`0`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `5`, `6`, `8`, `10`, `12`, `16`, `20`, `24`, `32`).
- **Pass/Fail Threshold**: Zero occurrences of arbitrary brackets on spacing utilities (`p-[13px]`, `m-[7px]`, `gap-[19px]`, `top-[23px]`).
- **Violation Example**: `<div className="p-[19px] mt-[13px] gap-[11px]">`
- **check:** `regex: (?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|top|bottom|left|right)-\[\d+px\] -> fail if matches found`

### `NEXT-UI-106: No Fixed-Width Page Breakage`
- **Statement**: Main container wrappers must use responsive fluid constraints (`max-w-* mx-auto w-full px-4`) instead of hardcoded pixel widths (`w-[1200px]`, `w-screen` without overflow safety).
- **Pass/Fail Threshold**: Zero occurrences of fixed pixel widths >= 400px on layout wrappers.
- **Violation Example**: `<div className="w-[1280px] flex flex-col">`
- **check:** `regex: w-\[\d{3,4}px\] -> extract width -> fail if width >= 400 and !has_class(/max-w/)`

### `NEXT-UI-107: Max Reading Width Constraint`
- **Statement**: Long-form text and blog/documentation articles must be constrained to a readable measure (`max-w-prose`, `max-w-2xl`, or `max-w-3xl`).
- **Pass/Fail Threshold**: Article bodies containing > 3 paragraphs must have a width constraint class (`max-w-*`).
- **Violation Example**: `<article className="w-full"> <p>...</p> <p>...</p> <p>...</p> </article>`
- **check:** `ast: JSXElement(name in ['article', 'main']) -> if children.filter(c => c.name === 'p').length >= 3 and !has_class(/max-w-(?:prose|xl|2xl|3xl|4xl)/) -> fail`

---

## 3. Color, Contrast & Anti-Cliché Rules (`NEXT-UI-xxx`)

### `NEXT-UI-108: Max 3 Palette Hues per Component View`
- **Statement**: A single component or view must not mix more than 3 distinct chromatic color families from Tailwind (e.g. Mixing purple + blue + green + pink + amber in one card).
- **Pass/Fail Threshold**: Set of chromatic color tokens (`bg-*-*`, `text-*-*`, `border-*-*` excluding neutrals: slate, gray, zinc, neutral, stone, black, white, transparent, currentColor) must have cardinality <= 3.
- **Violation Example**: `<div className="bg-purple-900 border-pink-500 text-cyan-300 shadow-amber-500 hover:bg-emerald-600">`
- **check:** `regex: \b(?:bg|text|border|ring)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b -> count unique color families -> fail if unique_families.size > 3`

### `NEXT-UI-109: Forbidden Purple-to-Pink Default AI Gradient Cliché`
- **Statement**: Prohibit the default AI trope combination `from-purple-* via-pink-* to-indigo-*` or `from-violet-* to-pink-*` applied across headline text.
- **Pass/Fail Threshold**: Zero occurrences of `bg-gradient-to-*` combining purple/violet with pink in text clips.
- **Violation Example**: `<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">`
- **check:** `regex: bg-clip-text\s+text-transparent\s+bg-gradient-to-[a-z]+\s+(?=.*from-(?:purple|violet)-\d+)(?=.*to-(?:pink|fuchsia)-\d+) -> fail if match found`

### `NEXT-UI-110: WCAG AA Minimum Contrast Ratio on Neutral Text`
- **Statement**: Subdued text colors must be at least `text-zinc-500` (on light mode) or `text-zinc-400` (on dark mode). Ultra-faint grays like `text-zinc-300` on white or `text-zinc-600` on black fail contrast.
- **Pass/Fail Threshold**: Zero occurrences of `text-slate-300`, `text-gray-300`, `text-zinc-300` against light backgrounds, or `text-slate-600`, `text-zinc-700` against dark backgrounds.
- **Violation Example**: `<span className="bg-white text-zinc-300 text-sm">Subtitle</span>`
- **check:** `regex: \b(?:bg-white|bg-zinc-50|bg-slate-50)\b[\s\S]{0,100}\b(?:text-slate-300|text-zinc-300|text-gray-300|text-neutral-300)\b -> fail if match found`

---

## 4. Component Hygiene & Token Consistency (`NEXT-UI-xxx`)

### `NEXT-UI-111: Zero Inline CSS Styles`
- **Statement**: All styles must be defined via Tailwind classes or CSS Modules. Raw `style={{ ... }}` objects are prohibited except for dynamic coordinates (e.g. slider thumbs or canvas positions).
- **Pass/Fail Threshold**: Zero occurrences of `style={{` with static layout/color properties (`color`, `fontSize`, `padding`, `margin`, `backgroundColor`).
- **Violation Example**: `<div style={{ marginTop: '14px', backgroundColor: '#1e1e2e' }}>`
- **check:** `ast: JSXAttribute(name === 'style') -> if value.properties.some(p => ['margin', 'padding', 'color', 'fontSize', 'backgroundColor'].includes(p.key.name)) -> fail`

### `NEXT-UI-112: Maximum 1 Box-Shadow Token per View`
- **Statement**: A single component/page view must use at most 1 distinct box-shadow utility (`shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`) to preserve unified elevation depth.
- **Pass/Fail Threshold**: Number of unique `shadow-*` utility classes (excluding `shadow-none`) in a single component file must be <= 1.
- **Violation Example**: A page utilizing `shadow-sm` on inputs, `shadow-md` on buttons, `shadow-xl` on cards, and `shadow-2xl` on modals.
- **check:** `regex: \bshadow-(?:sm|md|lg|xl|2xl|inner)\b -> collect matches -> fail if unique_matches.size > 1`

### `NEXT-UI-113: Consistent Border Radius Token Hierarchy`
- **Statement**: Interactive elements (buttons, inputs, selects) within a view must share the exact same border-radius token (e.g. All `rounded-md`, or all `rounded-lg`). Mixing `rounded-full` pills with `rounded-sm` squares in the same control group is prohibited.
- **Pass/Fail Threshold**: Controls in the same form/nav container must share the same `rounded-*` token.
- **Violation Example**: `<Button className="rounded-full">Submit</Button> <Input className="rounded-none" />`
- **check:** `ast: JSXElement(container in ['form', 'nav']) -> extract all control radius tokens -> fail if unique_radius_tokens.size > 1`

### `NEXT-UI-114: Card Nesting Hard Limit (Max Depth = 1)`
- **Statement**: Cards with borders and background fills must not be nested inside other bordered card containers.
- **Pass/Fail Threshold**: Depth of nested elements containing both `border` and `rounded-*` and `bg-*` must not exceed 1.
- **Violation Example**: `<Card className="border rounded-xl bg-card"> <Card className="border rounded-lg bg-muted"> ... </Card> </Card>`
- **check:** `ast: JSXElement(isCard) -> if has_descendant(isCard) -> fail`

---

## 5. Accessibility & Interaction States (`NEXT-UI-xxx`)

### `NEXT-UI-115: Complete Keyboard Focus Rings on Interactive Elements`
- **Statement**: Every clickable or focusable element (`<button>`, `<a>`, `<input>`, `<select>`, `<textarea>`) must declare explicit `focus-visible:` styles.
- **Pass/Fail Threshold**: 100% of interactive elements must have `focus-visible:outline-none focus-visible:ring-2` (or equivalent theme focus token).
- **Violation Example**: `<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Click</button>`
- **check:** `ast: JSXElement(name in ['button', 'input', 'select', 'textarea']) -> if !has_class(/focus-visible:ring/) and !has_class(/focus:ring/) -> fail`

### `NEXT-UI-116: Mandatory Aria-Label on Icon-Only Buttons`
- **Statement**: Buttons or interactive links that contain only an icon (SVG, Lucide icon) with no visible text string must provide an `aria-label` or `aria-labelledby` attribute.
- **Pass/Fail Threshold**: Any button without children text nodes must declare `aria-label`.
- **Violation Example**: `<button className="p-2 rounded-md hover:bg-muted"><TrashIcon className="h-4 w-4" /></button>`
- **check:** `ast: JSXElement(name === 'button') -> if !has_text_content() and !has_attribute('aria-label') and !has_attribute('aria-labelledby') -> fail`

### `NEXT-UI-117: Explicit Disabled State Styling and Accessibility`
- **Statement**: Custom buttons and form inputs must provide visual and functional disabled styles (`disabled:opacity-50 disabled:pointer-events-none`).
- **Pass/Fail Threshold**: Buttons supporting `disabled` prop must declare `disabled:` utility classes.
- **Violation Example**: `<button disabled={isLoading} className="bg-primary text-white px-4 py-2">Submit</button>`
- **check:** `ast: JSXElement(name === 'button' and has_prop('disabled')) -> if !has_class(/disabled:opacity/) and !has_class(/disabled:cursor-not-allowed/) -> fail`
