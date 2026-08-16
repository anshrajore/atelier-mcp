# Accessibility & Interaction State Standards

## 1. WCAG 2.1 AA Contrast Ratios
- **Normal Text (< 18.5px bold or < 24px regular)**: Minimum contrast ratio of **4.5:1** against the background.
- **Large Text (>= 18.5px bold or >= 24px regular)**: Minimum contrast ratio of **3.0:1**.
- **UI Components & Graphical Objects**: Minimum contrast ratio of **3.0:1** for borders, icons, and focus indicators.

### Problematic Color Combinations
- Gray text (`#94A3B8` / slate-400) on white background -> Contrast: ~2.5:1 (FAIL).
- Dark gray text (`#475569` / slate-600) on dark background (`#0F172A`) -> Contrast: ~2.1:1 (FAIL).

## 2. Interactive State Completeness
Interactive elements (buttons, inputs, checkboxes, interactive rows) must never be static.

### The 4 Mandatory States:
1. **Default**: Crisp baseline with appropriate affordance.
2. **Hover**: Visual change (`bg-primary/90`, subtle shadow or border highlight) with `transition-colors duration-150`.
3. **Focus-Visible**: High-contrast outline or ring (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none`) for keyboard navigation.
4. **Disabled**: Visual deemphasis (`opacity-50 pointer-events-none`) and accessible markup (`aria-disabled="true"`).
