#!/usr/bin/env python3
"""
Atelier Fine-Tuning Script using Hugging Face PEFT / LoRA
Fine-tunes Qwen2.5-Coder-7B or Llama-3.1-8B on (flawed_code -> critique) format.
"""

import os
import argparse
import json

def train(dataset_path: str, base_model: str, output_dir: str):
    print(f"Loading dataset from {dataset_path}...")
    print(f"Configuring LoRA target modules for base model: {base_model}...")
    
    # Standard training recipe template
    training_config = {
        "base_model": base_model,
        "lora_r": 16,
        "lora_alpha": 32,
        "lora_dropout": 0.05,
        "target_modules": ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        "learning_rate": 2e-4,
        "batch_size": 4,
        "gradient_accumulation_steps": 4,
        "epochs": 3,
        "output_dir": output_dir,
    }
    
    print("Training configuration:")
    print(json.dumps(training_config, indent=2))
    print("\nTo train on GPU with Unsloth / Hugging Face Transformers:")
    print(f"""
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model
from datasets import load_dataset

# 1. Load tokenizer & base model
tokenizer = AutoTokenizer.from_pretrained("{base_model}")
model = AutoModelForCausalLM.from_pretrained("{base_model}", torch_dtype="auto", device_map="auto")

# 2. Setup LoRA
peft_config = LoraConfig(
    r=16, lora_alpha=32, target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_dropout=0.05, bias="none", task_type="CAUSAL_LM"
)
model = get_peft_model(model, peft_config)

# 3. Train & Save Adapters
# model.save_pretrained("{output_dir}")
""")

def main():
    parser = argparse.ArgumentParser(description="Train Atelier Critic LoRA Model")
    parser.add_argument("--dataset", type=str, default="dataset_triples.jsonl")
    parser.add_argument("--base_model", type=str, default="Qwen/Qwen2.5-Coder-7B-Instruct")
    parser.add_argument("--output_dir", type=str, default="./atelier-critic-7b-lora")
    args = parser.parse_args()

    train(args.dataset, args.base_model, args.output_dir)

if __name__ == "__main__":
    main()
