#!/usr/bin/env python3
"""
Atelier Synthetic Data Generation & Distillation Pipeline
Generates (flawed_code -> critique -> fixed_code) triples using teacher frontier LLMs.
"""

import os
import json
import argparse
import asyncio
from typing import List, Dict, Any

TEACHER_SYSTEM_PROMPT = """You are a dataset generator for Atelier, a code critic system.
Generate a realistic coding scenario containing common AI-generated anti-patterns (UI design clichés or backend security/performance bugs).

Return a JSON object conforming strictly to:
{
  "critic": "ui" | "backend",
  "language": "typescript" | "python",
  "framework": "react" | "fastapi" | "express" | "tailwind",
  "flawed_code": string,
  "critique": {
    "score": number,
    "summary": string,
    "findings": [
      {
        "ruleId": string (e.g. "UI-105", "BE-201"),
        "severity": "critical" | "warning" | "suggestion",
        "title": string,
        "explanation": string,
        "concreteFix": string,
        "diff": string
      }
    ]
  },
  "fixed_code": string
}
"""

async def generate_single_example(example_id: int, critic_type: str) -> Dict[str, Any]:
    # Placeholder for teacher API call (OpenAI/Anthropic)
    print(f"Generating synthetic triple #{example_id} for {critic_type}...")
    
    # Template structure for demonstration
    if critic_type == "ui":
        return {
            "id": f"triple-ui-{example_id}",
            "critic": "ui",
            "language": "typescript",
            "framework": "react",
            "flawed_code": "<div className=\"bg-black text-white p-[17px] border border-purple-500\"><button>Click</button></div>",
            "critique": {
                "score": 60,
                "summary": "Detected uncalibrated spacing and purple-on-dark template pattern.",
                "findings": [
                    {
                        "ruleId": "UI-105",
                        "severity": "critical",
                        "title": "Forbidden Purple on Dark",
                        "explanation": "Stereotypical purple glow on pitch black background.",
                        "concreteFix": "Switch to neutral slate or zinc palette.",
                        "diff": "- bg-black border-purple-500\n+ bg-zinc-900 border-zinc-800"
                    },
                    {
                        "ruleId": "UI-101",
                        "severity": "suggestion",
                        "title": "Ad-hoc spacing 17px",
                        "explanation": "Violates 8pt/4pt harmonic grid.",
                        "concreteFix": "Use p-4 (16px).",
                        "diff": "- p-[17px]\n+ p-4"
                    }
                ]
            },
            "fixed_code": "<div className=\"bg-zinc-900 text-white p-4 border border-zinc-800\"><button className=\"px-4 py-2 rounded-md hover:bg-zinc-800 focus-visible:ring-2\">Click</button></div>"
        }
    else:
        return {
            "id": f"triple-be-{example_id}",
            "critic": "backend",
            "language": "typescript",
            "framework": "express",
            "flawed_code": "app.post('/login', async (req, res) => { const user = await db.user.findOne({ where: { email: req.body.email } }); });",
            "critique": {
                "score": 50,
                "summary": "Missing schema validation and rate limiting on authentication route.",
                "findings": [
                    {
                        "ruleId": "BE-202",
                        "severity": "critical",
                        "title": "Missing Schema Validation",
                        "explanation": "req.body is directly accessed without schema validation.",
                        "concreteFix": "Validate req.body with Zod schema.",
                        "diff": "+ const body = loginSchema.parse(req.body);"
                    }
                ]
            },
            "fixed_code": "app.post('/login', authLimiter, async (req, res) => { const body = loginSchema.parse(req.body); const user = await db.user.findOne({ where: { email: body.email } }); });"
        }

async def main():
    parser = argparse.ArgumentParser(description="Generate synthetic distillation dataset")
    parser.add_argument("--output", type=str, default="dataset_triples.jsonl", help="Output file path")
    parser.add_argument("--count", type=int, default=10, help="Number of examples to generate")
    args = parser.parse_args()

    examples = []
    for i in range(args.count):
        critic = "ui" if i % 2 == 0 else "backend"
        ex = await generate_single_example(i + 1, critic)
        examples.append(ex)

    with open(args.output, "w", encoding="utf-8") as f:
        for ex in examples:
            f.write(json.dumps(ex) + "\n")

    print(f"Generated {len(examples)} dataset triples to {args.output}")

if __name__ == "__main__":
    asyncio.run(main())
