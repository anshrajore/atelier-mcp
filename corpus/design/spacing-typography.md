# Spacing, Typography & Layout Discipline

## 1. The 4px / 8px Harmonic Spatial System
All layout decisions must derive from an 8pt base grid with a 4pt subgrid for fine adjustments.

| Token | Pixels | Rem (16px base) | Primary Usage |
|---|---|---|---|
| `1` | 4px | 0.25rem | Icon offsets, compact badge padding, inline gaps |
| `2` | 8px | 0.5rem | Button padding (Y), tight form group gaps |
| `3` | 12px | 0.75rem | Medium component inner padding, small card padding |
| `4` | 16px | 1.0rem | Standard button padding (X), input height padding, card gutter |
| `6` | 24px | 1.5rem | Card padding, section inner margin, grid column gap |
| `8` | 32px | 2.0rem | Container padding, modal header separation |
| `12` | 48px | 3.0rem | Major section separation (mobile) |
| `16` | 64px | 4.0rem | Major section separation (desktop), hero spacing |
| `24` | 96px | 6.0rem | Hero padding top/bottom |

## 2. Typographic Scales and Tracking Calibration
Never use arbitrary font sizes or uncalibrated line heights.

### Tracking Rules
- **Display Typography (>= 32px / 2rem)**: Always set negative tracking (`letter-spacing: -0.025em` to `-0.04em` or `tracking-tight` / `tracking-tighter`). Large fonts appear loose without tight tracking.
- **Headings (20px – 30px)**: Set slight negative tracking (`-0.015em`).
- **Body Text (14px – 18px)**: Set normal tracking (`0em`) with comfortable line height (`1.5` to `1.65`).
- **Overline / Micro-Labels (10px – 12px)**: If uppercase, always set wide tracking (`+0.05em` to `+0.1em` or `tracking-wider` / `tracking-widest`).

### Optimal Measure
Constrain text blocks to `65ch` (roughly 500px to 720px) to prevent cognitive fatigue during line scanning.
