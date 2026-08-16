#!/usr/bin/env python3
"""
Atelier Data Validation & Labeling Function QC (Stage 2)
Mechanically tests each training example against the rule's check logic.
Input must fail the check (positive) and fixed_output must pass.
"""

import json
import re
import argparse
from pathlib import Path
from typing import Dict, Any, List, Set

ROOT_DIR = Path(__file__).resolve().parent.parent.parent

def execute_mechanical_check(rule_id: str, code_str: str) -> bool:
    """
    Executes the literal mechanical check for a given rule.
    Returns True if the check PASSES (no violation), False if it FAILS (violation detected).
    """
    if "UI-101" in rule_id or "NEXT-UI-105" in rule_id:
        # Check arbitrary pixel spacing
        matches = re.findall(r"\b(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap)-\[(\d+)px\]\b", code_str)
        if matches:
            for val in matches:
                num = int(val)
                if num % 4 != 0 or num not in [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]:
                    return False

    if "UI-105" in rule_id or "NEXT-UI-109" in rule_id:
        # Check purple-on-dark / purple-to-pink gradient text
        if "bg-clip-text" in code_str and "text-transparent" in code_str:
            if re.search(r"from-(?:purple|violet)-\d+.*to-(?:pink|fuchsia)-\d+", code_str):
                return False

    if "UI-110" in rule_id or "NEXT-UI-115" in rule_id:
        # Check button focus ring
        if "<button" in code_str and "focus-visible:" not in code_str and "focus:" not in code_str:
            return False

    if "N8N-BE-201" in rule_id:
        # Check raw Authorization header in n8n
        try:
            data = json.loads(code_str)
            for node in data.get("nodes", []):
                params = node.get("parameters", {}).get("headerParameters", {}).get("parameters", [])
                for p in params:
                    if p.get("name", "").lower() == "authorization" and not p.get("value", "").startswith("={{"):
                        return False
        except Exception:
            pass

    if "N8N-BE-202" in rule_id:
        # Check raw API key in URL query params
        if re.search(r"[?&](?:api_?key|secret|token|password|auth)=([a-zA-Z0-9_\-]{8,})", code_str):
            if not re.search(r"[?&](?:api_?key|secret|token|password|auth)=\{\{", code_str):
                return False

    if "N8N-BE-209" in rule_id:
        # Check default node names
        try:
            data = json.loads(code_str)
            for node in data.get("nodes", []):
                if re.match(r"^(?:HTTP Request|Code|Webhook|If|Switch|Schedule|Set|Edit Fields|Filter)\d*$", node.get("name", ""), re.I):
                    return False
        except Exception:
            pass

    if "N8N-BE-210" in rule_id:
        # Check workflow error trigger
        try:
            data = json.loads(code_str)
            has_error_setting = bool(data.get("settings", {}).get("errorWorkflow"))
            has_error_node = any(n.get("type") == "n8n-nodes-base.errorTrigger" for n in data.get("nodes", []))
            if not has_error_setting and not has_error_node:
                return False
        except Exception:
            pass

    return True

def compute_snippet_hash(text: str) -> str:
    """Normalized hash to detect duplicate examples."""
    normalized = re.sub(r"\s+", " ", text.strip().lower())
    return str(hash(normalized))

def validate_dataset(input_file: Path, output_file: Path):
    if not input_file.exists():
        print(f"Input file not found: {input_file}")
        return

    print(f"Starting Mechanical Quality Control on {input_file}...")
    total_count = 0
    passed_count = 0
    dropped_count = 0
    rule_stats: Dict[str, Dict[str, int]] = {}
    seen_hashes: Set[str] = set()

    output_file.parent.mkdir(parents=True, exist_ok=True)
    with open(input_file, "r", encoding="utf-8") as in_f, open(output_file, "w", encoding="utf-8") as out_f:
        for line in in_f:
            if not line.strip():
                continue
            total_count += 1
            ex = json.loads(line)
            rule_ids = ex.get("rule_ids", [])
            inp = ex.get("input", "")
            fixed = ex.get("fixed_output", "")

            # Deduplication
            h = compute_snippet_hash(inp)
            if h in seen_hashes:
                dropped_count += 1
                continue
            seen_hashes.add(h)

            # Verification against mechanical checks
            is_valid = True
            if len(rule_ids) == 0:
                # Negative example: input MUST PASS all checks
                for r in ["UI-101", "UI-105", "UI-110", "N8N-BE-201", "N8N-BE-202", "N8N-BE-209", "N8N-BE-210"]:
                    if not execute_mechanical_check(r, inp):
                        is_valid = False
                        break
            else:
                # Positive example: input MUST FAIL at least one rule check, fixed_output MUST PASS
                for r in rule_ids:
                    if r not in rule_stats:
                        rule_stats[r] = {"total": 0, "rejected": 0}
                    rule_stats[r]["total"] += 1

                    # Input check (must detect flaw)
                    inp_pass = execute_mechanical_check(r, inp)
                    # Fixed check (must be clean)
                    fix_pass = execute_mechanical_check(r, fixed)

                    if inp_pass or not fix_pass:
                        is_valid = False
                        rule_stats[r]["rejected"] += 1

            if is_valid:
                passed_count += 1
                out_f.write(json.dumps(ex) + "\n")
            else:
                dropped_count += 1

    print("\n=======================================================")
    print("           ATELIER DATASET QC REPORT                   ")
    print("=======================================================")
    print(f"Total Examples Evaluated: {total_count}")
    print(f"Passed Mechanical Checks: {passed_count} ({passed_count/max(1, total_count)*100:.1f}%)")
    print(f"Dropped / Rejected:       {dropped_count}")
    print("-------------------------------------------------------")
    print("Per-Rule Rejection Rates:")
    for r, s in rule_stats.items():
        rej_rate = (s["rejected"] / max(1, s["total"])) * 100
        status = "⚠️ FLAGGED" if rej_rate > 25 else "✓ PASS"
        print(f"  {r:16} | Total: {s['total']:3} | Rej: {s['rejected']:2} ({rej_rate:4.1f}%) -> {status}")
    print("=======================================================\n")
    print(f"Validated dataset saved to: {output_file}")

def main():
    parser = argparse.ArgumentParser(description="Validate Atelier dataset against mechanical checks")
    parser.add_argument("--input", type=str, default="dataset/synthetic_triples.jsonl")
    parser.add_argument("--output", type=str, default="dataset/validated_triples.jsonl")
    args = parser.parse_args()

    in_p = Path(args.input)
    if not in_p.is_absolute():
        if (ROOT_DIR / args.input).exists():
            in_p = ROOT_DIR / args.input
        elif (ROOT_DIR / "model" / args.input).exists():
            in_p = ROOT_DIR / "model" / args.input
        else:
            in_p = Path.cwd() / args.input

    out_p = Path(args.output)
    if not out_p.is_absolute():
        out_p = ROOT_DIR / "model" / args.output

    validate_dataset(in_p, out_p)

if __name__ == "__main__":
    main()
