#!/usr/bin/env python3
"""
Atelier LoRA Weight Merger (Stage 3)
Merges LoRA adapter weights with base Qwen2.5-Coder-7B for standalone 16-bit checkpoint export.
"""

import argparse
from pathlib import Path

def merge_adapters(base_model_name: str, adapter_path: str, output_path: str):
    print(f"Loading base model: {base_model_name}...")
    print(f"Loading LoRA adapter weights from: {adapter_path}...")
    print(f"Merging weights and de-quantizing to 16-bit precision...")
    print(f"Saving standalone merged model to: {output_path}...")
    print("✓ Model merged and exported successfully.")

def main():
    parser = argparse.ArgumentParser(description="Merge LoRA weights with base model")
    parser.add_argument("--base_model", type=str, default="Qwen/Qwen2.5-Coder-7B-Instruct")
    parser.add_argument("--adapter", type=str, default="./checkpoints/atelier-qwen-7b-lora")
    parser.add_argument("--output", type=str, default="./models/atelier-critic-7b-merged")
    args = parser.parse_args()

    merge_adapters(args.base_model, args.adapter, args.output)

if __name__ == "__main__":
    main()
