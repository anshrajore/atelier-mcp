# Identifying and Eradicating AI Visual Clichés

LLM-generated frontend code disproportionately over-indexes on a narrow set of visual tropes that create a generic, unpolished appearance.

## 1. The Purple-on-Dark Template Tropes
- **The Tropes**: `#09090b` background + `#8b5cf6` or `#a855f7` glowing gradient borders + neon cyan secondary buttons.
- **The Root Problem**: LLM training sets contain thousands of low-effort SaaS landing page templates from 2023 that all mimic the exact same aesthetic.
- **The Remedy**:
  - Build purposeful color palettes grounded in subtle tones (e.g. Zinc, Slate, Stone, or Warm Neutral).
  - Use surface elevation (background shades like `bg-zinc-900` over `bg-zinc-950`) and crisp 1px borders (`border-zinc-800`) with subtle specular highlights instead of colored neon glows.

## 2. Floating Pill / Biscuit Badges
- **The Tropes**: A rounded pill centered right above the `<h1>` with a green or purple pulsing circle and text like `"Introducing our AI Engine ✨"`.
- **The Problem**: It dilutes the visual focal point and wastes vertical real estate with non-functional decoration.
- **The Remedy**: If status is required, attach it directly to the system indicator or navigation header. Otherwise, begin directly with the primary value proposition headline.

## 3. Rainbow Gradient Text Masks
- **The Tropes**: `bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500` on 2–3 words in the headline.
- **The Problem**: Severe readability degradation across different display color profiles and high visual noise.
- **The Remedy**: Rely on typographic weight contrasts (e.g., Light sub-lead + Bold primary headline) or a crisp single accent color.

## 4. Card-in-Card Russian Dolls
- **The Tropes**: A parent card container with `rounded-2xl border p-6`, inside which are three cards with `rounded-xl border p-4`, inside each are two badges with `rounded-lg border px-2 py-1`.
- **The Problem**: Visual clutter caused by nested border radiuses and boundary lines.
- **The Remedy**: Use whitespace, typography size contrast, and subtle background tint shifts to delineate sections without boxing everything into separate cards.
