# Contributing to Atelier 🏛️

Thank you for contributing to Atelier! Atelier is an open-source agent-skill and MCP server pack providing post-generation UI/UX and backend architecture critique.

---

## Architecture Principles

Every rule in Atelier must be **mechanically gradeable** (pass/fail via regex, AST, or JSON-key inspection). We do not accept subjective guidelines like *"make it clean"* or *"avoid bad patterns"* without an unambiguous mechanical threshold in the `check:` field.

---

## 1. Adding a Rule to the Universal Ruleset (`SKILL.md`)

1. Open `skills/atelier/SKILL.md`.
2. Locate the appropriate section (`## 1. UI/UX CRITIC RULES` or `## 2. BACKEND ARCHITECTURE GUARD RULES`).
3. Add a new rule with an incremental ID (e.g. `BASE-UI-106` or `BASE-BE-106`):

```markdown
### `BASE-UI-106: Focus Visible Indicators`
- **Statement**: Interactive elements must provide visible `:focus-visible` styling distinct from the default outline.
- **Pass/Fail Threshold**: Every interactive element (`<button>`, `<a>`, `<input>`, `<select>`) must declare explicit `focus-visible:` focus rings or `:focus-visible` CSS rules with minimum 2px outline width and contrast $\ge 3:1$.
- **Severity**: `warning`
- **Check**: `regex:focus-visible:(ring|outline|border)`
- **Auto-Fix Guidance**: Add `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary` to interactive elements.
```

4. Ensure your `Check:` field contains a valid mechanical test pattern (`regex:...` or `ast:...` or `json:...`).

---

## 2. Adding a Framework Preset

Framework presets reside in `skills/atelier/presets/<framework>.md` (e.g. `presets/svelte.md` or `presets/fastapi.md`).

1. Create a new markdown file in `skills/atelier/presets/`.
2. Define framework-specific rules referencing real component/AST patterns.
3. Every rule must follow the same schema with `Statement`, `Pass/Fail Threshold`, `Severity`, `Check`, and `Auto-Fix Guidance`.
4. Register the preset in `skills/atelier/SKILL.md` under the Framework Presets index.

---

## 3. Synchronizing Tool Adapters

After editing rules in `SKILL.md`:
```bash
npm run sync-adapters
```
Verify that the CI drift checker passes:
```bash
npm run check-sync
```

---

## 4. Regenerating Distillation & Training Data

When rules or checks change, regenerate the training corpus and re-validate:

1. **Dry-run validation (50 samples)**:
```bash
python3 model/data-gen/generate_triples.py --dry-run
```

2. **Full dataset generation**:
```bash
python3 model/data-gen/generate_triples.py --count 2500
```

3. **Mechanical QC pass**:
```bash
python3 model/data-gen/validate.py
```
Ensure all modified rules maintain a **0% rejection rate** and overall validation pass rate is $\ge 90\%$.

4. **Split dataset**:
```bash
python3 model/data-gen/split_dataset.py
```

---

## 5. Development & Testing

- **Build MCP Server**: `npm run build`
- **Run Verification Suite**: `node scripts/verify-tools.js`
- **Lint & Format**: Ensure code formatting conforms to repository standards.

---

## 6. Submitting a Pull Request

- Use descriptive commit messages following Conventional Commits (`feat:`, `fix:`, `docs:`).
- Include example code snippets demonstrating passing and failing test cases for any new rules.
- Ensure all CI checks and adapter synchronizations pass before requesting review.
