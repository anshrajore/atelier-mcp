#!/usr/bin/env bash
# =============================================================================
# Atelier QLoRA Fine-Tuning — RunPod Setup Script
# Target: RunPod GPU pod (A100 80GB or H100 80GB recommended)
# Base model: mistralai/Mistral-7B-v0.3 (or swap for Qwen/Qwen2.5-7B-Instruct)
# =============================================================================
set -euo pipefail

echo "=== Atelier RunPod Training Setup ==="
echo "Checking VRAM..."
nvidia-smi --query-gpu=name,memory.total --format=csv,noheader

# 1. Install dependencies
pip install -q \
  "transformers>=4.44.0" \
  "datasets>=2.20.0" \
  "trl>=0.9.6" \
  "peft>=0.12.0" \
  "bitsandbytes>=0.43.0" \
  "accelerate>=0.33.0" \
  "sentencepiece" \
  "safetensors" \
  "wandb" \
  "huggingface_hub"

echo "=== Dependencies installed ==="

# 2. Clone repo if not present
if [ ! -d "/workspace/atelier" ]; then
  git clone https://github.com/anshrajore/atelier-mcp.git /workspace/atelier
fi
cd /workspace/atelier

# 3. Upload dataset (if running fresh) OR copy from pod storage
# If you have the dataset locally, upload with:
#   runpodctl send model/dataset/train.jsonl
#   runpodctl send model/dataset/val.jsonl
# Then they'll be available at /workspace/ — move them:
mkdir -p model/dataset
[ -f /workspace/train.jsonl ] && cp /workspace/train.jsonl model/dataset/
[ -f /workspace/val.jsonl   ] && cp /workspace/val.jsonl   model/dataset/

# 4. HuggingFace login (set HF_TOKEN env var on RunPod)
huggingface-cli login --token "${HF_TOKEN:?Set HF_TOKEN env variable on RunPod}"

# 5. (Optional) WandB login
if [ -n "${WANDB_API_KEY:-}" ]; then
  wandb login "${WANDB_API_KEY}"
fi

echo "=== Starting QLoRA training ==="
python3 model/train/train.py

echo "=== Training complete. Merging adapter... ==="
python3 model/train/merge.py

echo "=== Exporting GGUF... ==="
python3 model/train/export_gguf.py

echo ""
echo "=== All done! ==="
echo "Merged model:  model/output/atelier-7b-merged/"
echo "GGUF model:    model/output/atelier-7b-q4.gguf"
echo ""
echo "To push to HuggingFace Hub:"
echo "  huggingface-cli upload anshrajore/atelier-7b model/output/atelier-7b-merged/"
