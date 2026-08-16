# Atelier Model Distillation & Fine-Tuning Pipeline

This directory contains the pipeline for distilling frontier models (Claude 3.5 Sonnet / GPT-4o) into self-hostable, low-latency critic models (e.g. **Qwen2.5-Coder-7B-Instruct** or **Llama-3.1-8B-Instruct**) using LoRA / QLoRA.

## Architecture

```
[Frontier Teacher LLM] 
       │ (Generates synthetic flawed code, grounded critiques, and verified fixes)
       ▼
[Dataset Builder] ──> dataset_triples.jsonl (Flawed Code -> Critique Findings -> Fixed Patch)
       │
       ▼
[LoRA / QLoRA Fine-Tuning] ──> Unsloth / Hugging Face PEFT on Qwen2.5-Coder-7B
       │
       ▼
[Local GGUF / vLLM / Ollama Server] ──> Plugs directly into `mcp-server` via `ATELIER_LLM_PROVIDER=ollama`
```

## Quickstart

### 1. Generate Synthetic Triples
```bash
export ANTHROPIC_API_KEY="your-key"
python3 pipeline/generate_dataset.py --output dataset.jsonl --count 500
```

### 2. Fine-Tune with Unsloth / PEFT
```bash
python3 training/train_lora.py --dataset dataset.jsonl --base_model "Qwen/Qwen2.5-Coder-7B-Instruct" --output_dir ./atelier-critic-7b-lora
```

### 3. Serve Locally
Export GGUF or serve via Ollama / vLLM:
```bash
ollama create atelier-critic -f Modelfile
export ATELIER_LLM_PROVIDER=ollama
export ATELIER_MODEL=atelier-critic
```
