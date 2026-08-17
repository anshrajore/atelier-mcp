# Atelier Marketing & Documentation Website

This directory contains the production marketing landing page and interactive documentation for **Atelier** (`@atelier/quality-gate`), built with **Next.js 14**, **Tailwind CSS**, **Orbitron**, and **JetBrains Mono**.

## 🎨 Visual Identity & Dogfooding Rules

This website strictly adheres to Atelier's own design principles:
- **Zero Unsemantic Gradients**: Dark cyan/graphite color tokens with high contrast surfaces.
- **Strict 8px Spacing Grid**: All padding, margins, and gaps are aligned to the 4px/8px modular scale.
- **Zero Emoji**: Professional technical typography and bespoke monochrome SVG telemetry indicators.
- **WCAG AA Compliance**: High-contrast ratios (`#ffffff`, `#00e5ff` on `#060a0f`).
- **Semantic Headings**: Single `<h1>` per page with strict sequential heading hierarchy.

## 🚀 Running Locally

```bash
# 1. Navigate to website directory
cd website

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build optimized static output
npm run build
```

## 📂 Page Routes

- `/`: Single-page marketing landing page with interactive terminal simulations, benchmark tables, and architecture blueprint.
- `/docs`: Dedicated documentation route with sidebar table of contents, 36-rule specification catalog, and MCP configuration guides.

---

**Engineered by [Ansh Rajore](https://github.com/anshrajore)**
