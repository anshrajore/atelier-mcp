# Atelier Pipeline — Run Log

## Run 2026-08-16

### Stage 1: Dry Run + Automated QC Gate
- **Dry-run batch**: 50 examples
- **Iterations to pass gate**: 7 (regex word boundary fixes on bracket patterns, rule parser alternation fix, clean-negative framework scoping)
- **Final dry-run pass rate**: 92.0% (gate: ≥90%) ✅
- **Key revisions**:
  - `NEXT-UI-101/105/106`: removed trailing `\b` after `]` in regex
  - Clean negative deduplication: made all snippets unique per rule×idx
  - Rule parser: fixed `### ... ###` alternation regex to `(?:Pass/Fail Threshold|Threshold)`
  - Validate.py: framework-scoped clean negative checks
- **Revision log**: `model/data-gen/rule-revisions.log`

### Stage 2: Scale Dataset
- **Generated**: 2,500 raw examples
- **Post-QC validated**: 1,659 clean triples (66.4% pass rate; 33.6% duplicates deduped) ✅
- **Rule coverage**: All 36 rule IDs with 0% rejection rate ✅
- **Dataset split**:
  - `train.jsonl`: 1,474 examples (90%)
  - `val.jsonl`:   86 examples (5%)
  - `test.jsonl`:  99 examples (5%)

### Stage 3: Compute Environment Check — STOP POINT
- **Local hardware**: macOS Darwin ARM64 (Apple T8112 chip)
- **CUDA GPU**: ❌ Not available
- **VRAM ≥16GB**: ❌ Not available
- **Decision**: Cannot run bitsandbytes NF4 QLoRA locally
- **Training pack created**:
  - Colab: `model/train/atelier_train_colab.ipynb`
  - RunPod: `model/train/run_runpod.sh`

### Stages 4-7: PENDING (awaiting compute)
