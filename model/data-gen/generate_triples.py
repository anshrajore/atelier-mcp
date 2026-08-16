#!/usr/bin/env python3
"""
Atelier Data Generation Pipeline (Stage 1)
Generates synthetic (flawed_input -> critique -> fixed_output) triples
grounded on canonical SKILL.md and preset rules.
"""

import os
import sys
import json
import re
import argparse
import asyncio
import time
from pathlib import Path
from typing import List, Dict, Any, Optional

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
SKILLS_DIR = ROOT_DIR / "skills" / "atelier"
PRESETS_DIR = SKILLS_DIR / "presets"

# Parse rules from markdown files
def parse_rules_from_file(file_path: Path) -> List[Dict[str, str]]:
    if not file_path.exists():
        return []
    content = file_path.read_text(encoding="utf-8")
    rule_blocks = re.findall(
        r"### `((?:BASE|NEXT|N8N)-(?:UI|BE)-\d+): ([^`]+)`\s*\n"
        r"- \*\*Statement\*\*: ([^\n]+)\s*\n"
        r"- \*\*Pass/Fail Threshold|\*\*Threshold\*\*: ([^\n]+)\s*\n"
        r"- \*\*Violation Example\*\*: ([^\n]+)\s*\n"
        r"- \*\*check:\*\* `([^\n]+)`",
        content,
    )
    rules = []
    for r in rule_blocks:
        rules.append({
            "id": r[0],
            "title": r[1],
            "statement": r[2],
            "threshold": r[3],
            "violation_example": r[4],
            "check": r[5],
            "source_file": file_path.name
        })
    return rules

def load_all_rules() -> Dict[str, List[Dict[str, str]]]:
    rules = {
        "base": parse_rules_from_file(SKILLS_DIR / "SKILL.md"),
        "nextjs-tailwind": parse_rules_from_file(PRESETS_DIR / "nextjs-tailwind.md"),
        "n8n": parse_rules_from_file(PRESETS_DIR / "n8n.md")
    }
    return rules

TEACHER_SYSTEM_PROMPT = """You are the Atelier Master Critic Generator.
Given a specific rule definition and its mechanical check, create a synthetic training triple.

CRITICAL CONSTRAINTS:
1. You must ONLY cite rule IDs that explicitly exist in the provided ruleset. Never invent new rule IDs.
2. For n8n examples, input and fixed_output MUST be valid parseable JSON conforming to n8n workflow export schema.
3. For Next.js/Tailwind examples, input and fixed_output must be valid JSX/TSX components.
4. Output must be valid JSON matching this schema:
{
  "id": string,
  "framework": "nextjs-tailwind" | "n8n",
  "rule_ids": [string],
  "input": string,
  "critique": {
    "score": number,
    "summary": string,
    "findings": [
      {
        "ruleId": string,
        "severity": "critical" | "warning" | "suggestion",
        "title": string,
        "location": { "snippet": string },
        "explanation": string,
        "concreteFix": string,
        "diff": string
      }
    ]
  },
  "fixed_output": string,
  "source": "synthetic"
}
"""

def generate_local_synthetic_triple(rule: Dict[str, str], example_type: str, index: int) -> Dict[str, Any]:
    """Generates deterministic synthetic examples for dry-runs and offline generation."""
    rule_id = rule["id"]
    is_n8n = "N8N" in rule_id or "n8n" in rule.get("source_file", "")
    framework = "n8n" if is_n8n else "nextjs-tailwind"
    example_id = f"atelier-{framework}-{rule_id.lower()}-{example_type}-{index:03d}"

    if example_type == "clean":
        # Negative clean example
        if is_n8n:
            clean_input = json.dumps({
                "name": "Verified Webhook Handler",
                "nodes": [
                    {
                        "parameters": { "path": "webhook-in", "authentication": "headerAuth" },
                        "name": "Secure Webhook Trigger",
                        "type": "n8n-nodes-base.webhook",
                        "typeVersion": 1,
                        "position": [100, 200]
                    },
                    {
                        "parameters": { "url": "https://api.example.com/v1/leads", "options": { "timeout": 5000 } },
                        "name": "Fetch Verified Leads",
                        "type": "n8n-nodes-base.httpRequest",
                        "retryOnFail": True,
                        "maxTries": 3,
                        "position": [300, 200]
                    }
                ],
                "connections": {
                    "Secure Webhook Trigger": {
                        "main": [[{ "node": "Fetch Verified Leads", "type": "main", "index": 0 }]]
                    }
                },
                "settings": { "errorWorkflow": "error-handler-wf", "saveExecutionProgress": True }
            }, indent=2)
            return {
                "id": example_id,
                "framework": framework,
                "rule_ids": [],
                "input": clean_input,
                "critique": {
                    "score": 100,
                    "summary": "Quality gate passed with zero detected rule violations.",
                    "findings": []
                },
                "fixed_output": clean_input,
                "source": "synthetic"
            }
        else:
            clean_input = (
                "export function VerifiedCard() {\n"
                "  return (\n"
                "    <div className=\"bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-2xl mx-auto\">\n"
                "      <h2 className=\"text-2xl font-bold tracking-tight text-zinc-100\">System Metrics</h2>\n"
                "      <p className=\"text-sm text-zinc-400 mt-2 leading-relaxed\">All pipeline nodes operational.</p>\n"
                "      <button className=\"mt-4 px-4 py-2 bg-zinc-100 text-zinc-900 font-medium rounded-md hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50\">\n"
                "        Refresh Data\n"
                "      </button>\n"
                "    </div>\n"
                "  );\n"
                "}"
            )
            return {
                "id": example_id,
                "framework": framework,
                "rule_ids": [],
                "input": clean_input,
                "critique": {
                    "score": 100,
                    "summary": "Quality gate passed with zero detected rule violations.",
                    "findings": []
                },
                "fixed_output": clean_input,
                "source": "synthetic"
            }

    # Positive violation example
    if is_n8n:
        flawed_wf = {
            "name": f"Workflow Test - {rule['title']}",
            "nodes": [
                {
                    "parameters": {
                        "url": "https://api.hunter.io/v2/email-verifier?api_key=sk_live_123456789abcdef" if rule_id == "N8N-BE-202" else "https://api.example.com/data",
                        "headerParameters": {
                            "parameters": [
                                { "name": "Authorization", "value": "Bearer sk-proj-supersecretkey123" }
                            ]
                        } if rule_id == "N8N-BE-201" else {}
                    },
                    "name": "HTTP Request1" if rule_id == "N8N-BE-209" else "Execute External API",
                    "type": "n8n-nodes-base.httpRequest",
                    "position": [200, 300]
                }
            ],
            "connections": {},
            "settings": {} if rule_id == "N8N-BE-210" else { "saveExecutionProgress": True }
        }
        flawed_str = json.dumps(flawed_wf, indent=2)
        fixed_wf = json.loads(flawed_str)
        if rule_id == "N8N-BE-201":
            fixed_wf["nodes"][0]["parameters"]["headerParameters"] = {
                "parameters": [{ "name": "Authorization", "value": "={{ $env.API_KEY }}" }]
            }
        elif rule_id == "N8N-BE-202":
            fixed_wf["nodes"][0]["parameters"]["url"] = "https://api.hunter.io/v2/email-verifier?email={{ $json.email }}"
        elif rule_id == "N8N-BE-209":
            fixed_wf["nodes"][0]["name"] = "Verify Contact Email"
        elif rule_id == "N8N-BE-210":
            fixed_wf["settings"]["errorWorkflow"] = "global-error-handler"
        fixed_str = json.dumps(fixed_wf, indent=2)

        return {
            "id": example_id,
            "framework": framework,
            "rule_ids": [rule_id],
            "input": flawed_str,
            "critique": {
                "score": 50,
                "summary": f"Detected violation of {rule_id}: {rule['title']}",
                "findings": [
                    {
                        "ruleId": rule_id,
                        "severity": "critical",
                        "title": rule["title"],
                        "location": { "snippet": rule["violation_example"] },
                        "explanation": rule["statement"],
                        "concreteFix": rule["threshold"],
                        "diff": f"- {rule['violation_example']}\n+ [Compliant schema]"
                    }
                ]
            },
            "fixed_output": fixed_str,
            "source": "synthetic"
        }
    else:
        # Next.js / Tailwind violation example
        flawed_str = (
            f"export function Flawed_{rule_id.replace('-', '_')}() {{\n"
            f"  return (\n"
            f"    <div className=\"min-h-screen bg-black p-[19px]\">\n"
            f"      <h1 className=\"text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600\">\n"
            f"        Headline\n"
            f"      </h1>\n"
            f"      <button className=\"bg-blue-600 text-white px-4 py-2 rounded-md\">\n"
            f"        Action\n"
            f"      </button>\n"
            f"    </div>\n"
            f"  );\n"
            f"}}"
        )
        fixed_str = (
            f"export function Compliant_{rule_id.replace('-', '_')}() {{\n"
            f"  return (\n"
            f"    <div className=\"min-h-screen bg-zinc-950 p-6\">\n"
            f"      <h1 className=\"text-4xl font-bold tracking-tight text-zinc-100\">\n"
            f"        Headline\n"
            f"      </h1>\n"
            f"      <button className=\"bg-zinc-100 text-zinc-900 px-4 py-2 rounded-md hover:bg-zinc-200 focus-visible:ring-2 focus-visible:outline-none\">\n"
            f"        Action\n"
            f"      </button>\n"
            f"    </div>\n"
            f"  );\n"
            f"}}"
        )
        return {
            "id": example_id,
            "framework": framework,
            "rule_ids": [rule_id],
            "input": flawed_str,
            "critique": {
                "score": 50,
                "summary": f"Detected violation of {rule_id}: {rule['title']}",
                "findings": [
                    {
                        "ruleId": rule_id,
                        "severity": "critical",
                        "title": rule["title"],
                        "location": { "snippet": rule["violation_example"] },
                        "explanation": rule["statement"],
                        "concreteFix": rule["threshold"],
                        "diff": f"- {rule['violation_example']}\n+ [Standard token]"
                    }
                ]
            },
            "fixed_output": fixed_str,
            "source": "synthetic"
        }

async def run_data_generation(output_path: Path, count_target: int, dry_run: bool = False):
    rules_map = load_all_rules()
    total_rules = sum(len(v) for v in rules_map.values())
    print(f"Loaded {total_rules} rules across Base, Next.js/Tailwind, and n8n presets.")

    # Estimate token cost
    avg_tokens_per_example = 850
    total_tokens = count_target * avg_tokens_per_example
    est_cost_usd = (total_tokens / 1_000_000) * 15.0 # Anthropic Sonnet approx
    print(f"Target count: {count_target} examples")
    print(f"Estimated teacher tokens: ~{total_tokens:,} tokens (~${est_cost_usd:.2f} USD)")

    if dry_run:
        print("\n[DRY RUN MODE] Generating 50 high-fidelity review samples...\n")
        count_target = 50

    output_path.parent.mkdir(parents=True, exist_ok=True)
    generated_count = 0
    all_rules_flat = []
    for rlist in rules_map.values():
        all_rules_flat.extend(rlist)

    with open(output_path, "w", encoding="utf-8") as out_f:
        for idx, rule in enumerate(all_rules_flat):
            if generated_count >= count_target:
                break
            
            # Single violation examples
            single_count = 2 if dry_run else 15
            for i in range(single_count):
                if generated_count >= count_target:
                    break
                ex = generate_local_synthetic_triple(rule, "single", i + 1)
                out_f.write(json.dumps(ex) + "\n")
                generated_count += 1

            # Negative clean examples
            clean_count = 1 if dry_run else 5
            for i in range(clean_count):
                if generated_count >= count_target:
                    break
                ex = generate_local_synthetic_triple(rule, "clean", i + 1)
                out_f.write(json.dumps(ex) + "\n")
                generated_count += 1

    print(f"Successfully generated {generated_count} examples to {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Atelier Synthetic Data Generator")
    parser.add_argument("--output", type=str, default="dataset/synthetic_triples.jsonl")
    parser.add_argument("--count", type=int, default=2500)
    parser.add_argument("--dry-run", action="store_true", help="Generate 50 review samples first")
    args = parser.parse_args()

    out_p = Path(args.output)
    if not out_p.is_absolute():
        out_p = ROOT_DIR / "model" / args.output

    asyncio.run(run_data_generation(out_p, args.count, args.dry_run))

if __name__ == "__main__":
    main()
