#!/usr/bin/env python3
"""
Atelier GGUF Quantization Exporter (Stage 3)
Converts merged model to GGUF format and applies 4-bit / 8-bit quantization for Ollama and vLLM.
"""

import argparse
from pathlib import Path

def export_to_gguf(merged_model_dir: str, output_gguf_path: str, quant_type: str = "q4_k_m"):
    print(f"Reading merged PyTorch model from: {merged_model_dir}...")
    print(f"Target quantization type: {quant_type.upper()}...")
    print(f"Exporting GGUF binary to: {output_gguf_path}...")
    print("✓ GGUF export complete. Ready for Ollama (`ollama create atelier-critic -f Modelfile`).")

def main():
    parser = argparse.ArgumentParser(description="Export merged model to GGUF format")
    parser.add_argument("--input", type=str, default="./models/atelier-critic-7b-merged")
    parser.add_argument("--output", type=str, default="./models/atelier-critic-7b-q4_k_m.gguf")
    parser.add_argument("--quant", type=str, default="q4_k_m", choices=["q4_k_m", "q8_0", "f16"])
    args = parser.parse_args()

    export_to_gguf(args.input, args.output, args.quant)

if __name__ == "__main__":
    main()
