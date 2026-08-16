#!/usr/bin/env python3
"""
Atelier Mechanical Validation & QC Pipeline (Stage 2 - Revision 2)
Tests every single rule against exact mechanical criteria.
"""

import json
import re
import argparse
from pathlib import Path
from typing import Dict, Any, List, Set, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
SKILLS_DIR = ROOT_DIR / "skills" / "atelier"
PRESETS_DIR = SKILLS_DIR / "presets"

def get_all_canonical_rule_ids() -> Set[str]:
    rule_ids = set()
    for md_file in [SKILLS_DIR / "SKILL.md", PRESETS_DIR / "nextjs-tailwind.md", PRESETS_DIR / "n8n.md"]:
        if md_file.exists():
            content = md_file.read_text(encoding="utf-8")
            matches = re.findall(r"### `((?:BASE|NEXT|N8N)-(?:UI|BE)-\d+):", content)
            rule_ids.update(matches)
    return rule_ids

def execute_mechanical_check(rule_id: str, code_str: str) -> bool:
    """
    Returns True if code PASSES the rule (no violation detected),
    False if code FAILS the rule (violation detected).
    """
    # UI Spacing (BASE-UI-101 / NEXT-UI-105)
    if rule_id in ["BASE-UI-101", "NEXT-UI-105"]:
        if re.search(r"(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap)-\[(\d+)px\]", code_str):
            matches = re.findall(r"(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap)-\[(\d+)px\]", code_str)
            for val in matches:
                num = int(val)
                if rule_id == "NEXT-UI-105" or (num % 4 != 0 or num not in [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128]):
                    return False
        if re.search(r"(?:margin|padding|gap):\s*(\d+)px", code_str):
            nums = [int(n) for n in re.findall(r"(?:margin|padding|gap):\s*(\d+)px", code_str)]
            if any(n % 4 != 0 for n in nums):
                return False

    # Font size token (NEXT-UI-101)
    elif rule_id == "NEXT-UI-101":
        if re.search(r"text-\[\d+(?:px|rem)\]", code_str):
            return False

    # Minimum Body Text (NEXT-UI-102)
    elif rule_id == "NEXT-UI-102":
        if re.search(r"<p\b[^>]*\btext-xs\b", code_str):
            return False

    # Display Tracking (BASE-UI-102 / NEXT-UI-103)
    elif rule_id in ["BASE-UI-102", "NEXT-UI-103"]:
        if re.search(r"text-[3-6]xl", code_str) and not re.search(r"tracking-tight(?:er)?", code_str):
            return False

    # Body Line Height (NEXT-UI-104)
    elif rule_id == "NEXT-UI-104":
        if re.search(r"<p\b[^>]*\b(?:leading-none|leading-tight|leading-3|leading-4)\b", code_str):
            return False

    # Single CTA (BASE-UI-104)
    elif rule_id == "BASE-UI-104":
        if code_str.count('variant="primary"') > 1 or code_str.count("btn-primary") > 1:
            return False

    # Gradient Cliché (BASE-UI-105 / NEXT-UI-109)
    elif rule_id in ["BASE-UI-105", "NEXT-UI-109"]:
        if "bg-clip-text" in code_str and "text-transparent" in code_str:
            if re.search(r"from-(?:purple|violet)-\d+.*to-(?:pink|fuchsia)-\d+", code_str):
                return False

    # Fixed width layout breakage (NEXT-UI-106)
    elif rule_id == "NEXT-UI-106":
        m = re.search(r"w-\[(\d{3,4})px\]", code_str)
        if m and int(m.group(1)) >= 400:
            return False

    # Reading width constraint (NEXT-UI-107)
    elif rule_id == "NEXT-UI-107":
        if "<article" in code_str and code_str.count("<p>") >= 3 and not re.search(r"max-w-(?:prose|xl|2xl|3xl|4xl|7xl)", code_str):
            return False

    # Multi hue mix (NEXT-UI-108)
    elif rule_id == "NEXT-UI-108":
        hues = set(re.findall(r"\b(?:bg|text|border|ring)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b", code_str))
        if len(hues) > 3:
            return False

    # Contrast Minimum (BASE-UI-103 / NEXT-UI-110)
    elif rule_id in ["BASE-UI-103", "NEXT-UI-110"]:
        if re.search(r"(?:bg-white|bg-zinc-50|bg-slate-50)[\s\S]{0,80}(?:text-slate-300|text-zinc-300|text-gray-300)", code_str):
            return False

    # Inline styles (NEXT-UI-111)
    elif rule_id == "NEXT-UI-111":
        if "style={{" in code_str and any(k in code_str for k in ["marginTop", "backgroundColor", "padding", "margin", "fontSize"]):
            return False

    # Multi Shadow (NEXT-UI-112)
    elif rule_id == "NEXT-UI-112":
        shadows = set(re.findall(r"\bshadow-(?:sm|md|lg|xl|2xl|inner)\b", code_str))
        if len(shadows) > 1:
            return False

    # Radius Mix (NEXT-UI-113)
    elif rule_id == "NEXT-UI-113":
        if "rounded-full" in code_str and "rounded-none" in code_str:
            return False

    # Nested Cards (NEXT-UI-114)
    elif rule_id == "NEXT-UI-114":
        if re.search(r"border rounded-xl bg-card[\s\S]{0,100}border rounded-lg bg-muted", code_str):
            return False

    # Focus Rings (BASE-UI-110 / NEXT-UI-115)
    elif rule_id in ["BASE-UI-110", "NEXT-UI-115"]:
        if "<button" in code_str and "focus-visible:" not in code_str and "focus:" not in code_str:
            return False

    # Icon Button Aria (NEXT-UI-116)
    elif rule_id == "NEXT-UI-116":
        if "<button" in code_str and "Icon" in code_str and "aria-label" not in code_str:
            return False

    # Disabled styles (NEXT-UI-117)
    elif rule_id == "NEXT-UI-117":
        if "disabled=" in code_str and "disabled:opacity" not in code_str and "disabled:cursor-not-allowed" not in code_str:
            return False

    # Backend Secrets (BASE-BE-201)
    elif rule_id == "BASE-BE-201":
        if re.search(r"(?:JWT_SECRET|API_KEY|SECRET_KEY|DATABASE_URL)\s*(?:=|:|\?\?|\|\|)\s*['\"][a-zA-Z0-9_\-]{8,}['\"]", code_str):
            return False

    # Boundary validation (BASE-BE-202)
    elif rule_id == "BASE-BE-202":
        if "req.body" in code_str and not any(v in code_str for v in [".parse(", ".validate(", "z.object", "BaseModel", "schema.parse"]):
            return False

    # Error exposure (BASE-BE-203)
    elif rule_id == "BASE-BE-203":
        if "err.stack" in code_str or "err.sql" in code_str:
            return False

    # Empty catch (BASE-BE-204)
    elif rule_id == "BASE-BE-204":
        if re.search(r"catch\s*\([a-zA-Z0-9_]*\)\s*\{\s*\}", code_str):
            return False

    # Fetch timeout (BASE-BE-205)
    elif rule_id == "BASE-BE-205":
        if "fetch(" in code_str and "timeout" not in code_str and "signal" not in code_str:
            return False

    # n8n Auth Header (N8N-BE-201)
    elif rule_id == "N8N-BE-201":
        try:
            wf = json.loads(code_str)
            for node in wf.get("nodes", []):
                params = node.get("parameters", {}).get("headerParameters", {}).get("parameters", [])
                for p in params:
                    if p.get("name", "").lower() == "authorization" and not str(p.get("value", "")).startswith("={{"):
                        return False
        except Exception:
            pass

    # n8n Raw Query Key (N8N-BE-202)
    elif rule_id == "N8N-BE-202":
        if re.search(r"[?&](?:api_?key|secret|token|password|auth)=([a-zA-Z0-9_\-]{8,})", code_str):
            if not re.search(r"[?&](?:api_?key|secret|token|password|auth)=\{\{", code_str):
                return False

    # n8n Orphan Nodes (N8N-BE-203)
    elif rule_id == "N8N-BE-203":
        try:
            wf = json.loads(code_str)
            nodes = wf.get("nodes", [])
            conns = wf.get("connections", {})
            targets = set()
            for src, outputs in conns.items():
                for out_type, branches in outputs.items():
                    for branch in branches:
                        for dest in branch:
                            targets.add(dest.get("node"))
            for node in nodes:
                ntype = node.get("type", "").lower()
                nname = node.get("name", "")
                if "trigger" not in ntype and "webhook" not in ntype and nname not in targets:
                    return False
        except Exception:
            pass

    # n8n Dead End IF (N8N-BE-204)
    elif rule_id == "N8N-BE-204":
        try:
            wf = json.loads(code_str)
            for node in wf.get("nodes", []):
                if node.get("type") == "n8n-nodes-base.if":
                    conn = wf.get("connections", {}).get(node.get("name"), {}).get("main", [])
                    if len(conn) < 2 or len(conn[0]) == 0 or len(conn[1]) == 0:
                        return False
        except Exception:
            pass

    # n8n Dangling Catch (N8N-BE-205)
    elif rule_id == "N8N-BE-205":
        try:
            wf = json.loads(code_str)
            for node in wf.get("nodes", []):
                if node.get("onError") == "continueErrorOutput":
                    conn = wf.get("connections", {}).get(node.get("name"), {}).get("main", [])
                    if len(conn) < 2 or len(conn[1]) == 0:
                        return False
        except Exception:
            pass

    # n8n HTTP Timeout (N8N-BE-206)
    elif rule_id == "N8N-BE-206":
        try:
            wf = json.loads(code_str)
            for node in wf.get("nodes", []):
                if node.get("type") == "n8n-nodes-base.httpRequest":
                    t = node.get("parameters", {}).get("options", {}).get("timeout")
                    if not t or t > 30000:
                        return False
        except Exception:
            pass

    # n8n Retry On Fail (N8N-BE-207)
    elif rule_id == "N8N-BE-207":
        try:
            wf = json.loads(code_str)
            for node in wf.get("nodes", []):
                if node.get("type") in ["n8n-nodes-base.httpRequest", "n8n-nodes-base.openAi"]:
                    if not node.get("retryOnFail") or node.get("maxTries", 1) < 2:
                        return False
        except Exception:
            pass

    # n8n Batch Wait (N8N-BE-208)
    elif rule_id == "N8N-BE-208":
        try:
            wf = json.loads(code_str)
            has_batch = any(n.get("type") == "n8n-nodes-base.splitInBatches" for n in wf.get("nodes", []))
            has_wait = any(n.get("type") == "n8n-nodes-base.wait" for n in wf.get("nodes", []))
            if has_batch and not has_wait:
                return False
        except Exception:
            pass

    # n8n Generic Names (N8N-BE-209)
    elif rule_id == "N8N-BE-209":
        try:
            wf = json.loads(code_str)
            for node in wf.get("nodes", []):
                if re.match(r"^(?:HTTP Request|Code|Webhook|If|Switch|Schedule|Set|Edit Fields|Filter)\d*$", node.get("name", ""), re.I):
                    return False
        except Exception:
            pass

    # n8n Error Trigger (N8N-BE-210)
    elif rule_id == "N8N-BE-210":
        try:
            wf = json.loads(code_str)
            has_setting = bool(wf.get("settings", {}).get("errorWorkflow"))
            has_node = any(n.get("type") == "n8n-nodes-base.errorTrigger" for n in wf.get("nodes", []))
            if not has_setting and not has_node:
                return False
        except Exception:
            pass

    # n8n Progress Retention (N8N-BE-211)
    elif rule_id == "N8N-BE-211":
        try:
            wf = json.loads(code_str)
            if wf.get("settings", {}).get("saveExecutionProgress") is not True:
                return False
        except Exception:
            pass

    # n8n Sandbox Escape (N8N-BE-212)
    elif rule_id == "N8N-BE-212":
        try:
            wf = json.loads(code_str)
            for node in wf.get("nodes", []):
                if node.get("type") == "n8n-nodes-base.code":
                    code = node.get("parameters", {}).get("jsCode", "")
                    if re.search(r"(?:process\.env|require\(['\"](?:fs|child_process|net)['\"]\)|eval\()", code):
                        return False
        except Exception:
            pass

    # n8n Webhook Auth (N8N-BE-213)
    elif rule_id == "N8N-BE-213":
        try:
            wf = json.loads(code_str)
            for node in wf.get("nodes", []):
                if node.get("type") == "n8n-nodes-base.webhook":
                    auth = node.get("parameters", {}).get("authentication", "")
                    path = node.get("parameters", {}).get("path", "")
                    if auth == "none" and re.search(r"(?:charge|payment|delete|update|user|admin|auth)", path):
                        return False
        except Exception:
            pass

    return True

def run_dataset_qc(input_file: Path, output_file: Path) -> Dict[str, Any]:
    canonical_rule_ids = get_all_canonical_rule_ids()
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
            critique = ex.get("critique", {})

            # 1. Hallucinated rule ID check
            cited_rule_ids = [f.get("ruleId") for f in critique.get("findings", []) if f.get("ruleId")]
            if any(r not in canonical_rule_ids for r in cited_rule_ids):
                dropped_count += 1
                continue

            # 2. n8n JSON schema validation
            if ex.get("framework") == "n8n":
                try:
                    wf_inp = json.loads(inp)
                    wf_fix = json.loads(fixed)
                    if "nodes" not in wf_inp or "nodes" not in wf_fix:
                        dropped_count += 1
                        continue
                except Exception:
                    dropped_count += 1
                    continue

            # 3. Deduplication
            norm_hash = str(hash(re.sub(r"\s+", " ", inp.strip().lower())))
            if norm_hash in seen_hashes:
                dropped_count += 1
                continue
            seen_hashes.add(norm_hash)

            # 4. Mechanical check validation
            is_valid = True
            if len(rule_ids) == 0:
                # Clean negative example: test only relevant checks for that framework
                fw = ex.get("framework", "general")
                checks_to_run = (
                    ["BASE-UI-101", "NEXT-UI-101", "BASE-UI-102", "BASE-UI-105", "NEXT-UI-109", "BASE-UI-110", "NEXT-UI-115"]
                    if fw == "nextjs-tailwind" else
                    ["N8N-BE-201", "N8N-BE-202", "N8N-BE-203", "N8N-BE-206", "N8N-BE-207", "N8N-BE-209", "N8N-BE-210", "N8N-BE-211", "N8N-BE-212", "N8N-BE-213"]
                )
                for r in checks_to_run:
                    if not execute_mechanical_check(r, inp):
                        is_valid = False
                        break
                rule_stats.setdefault("CLEAN_NEGATIVE", {"total": 0, "rejected": 0})
                rule_stats["CLEAN_NEGATIVE"]["total"] += 1
                if not is_valid:
                    rule_stats["CLEAN_NEGATIVE"]["rejected"] += 1
            else:
                for r in rule_ids:
                    rule_stats.setdefault(r, {"total": 0, "rejected": 0})
                    rule_stats[r]["total"] += 1
                    inp_pass = execute_mechanical_check(r, inp)
                    fix_pass = execute_mechanical_check(r, fixed)
                    # For violation example: input must fail check, fix must pass check
                    if inp_pass or not fix_pass:
                        is_valid = False
                        rule_stats[r]["rejected"] += 1

            if is_valid:
                passed_count += 1
                out_f.write(json.dumps(ex) + "\n")
            else:
                dropped_count += 1

    pass_rate = (passed_count / max(1, total_count)) * 100
    return {
        "total": total_count,
        "passed": passed_count,
        "dropped": dropped_count,
        "pass_rate": pass_rate,
        "rule_stats": rule_stats
    }

def main():
    parser = argparse.ArgumentParser(description="Atelier QC & Mechanical Validator")
    parser.add_argument("--input", type=str, default="dataset/synthetic_triples.jsonl")
    parser.add_argument("--output", type=str, default="dataset/validated_triples.jsonl")
    args = parser.parse_args()

    in_p = Path(args.input)
    if not in_p.is_absolute():
        if (ROOT_DIR / args.input).exists(): in_p = ROOT_DIR / args.input
        elif (ROOT_DIR / "model" / args.input).exists(): in_p = ROOT_DIR / "model" / args.input
        else: in_p = Path.cwd() / args.input

    out_p = Path(args.output)
    if not out_p.is_absolute():
        # Avoid double-prefixing: if path already starts with "model/", use ROOT_DIR directly
        if args.output.startswith("model/"):
            out_p = ROOT_DIR / args.output
        else:
            out_p = ROOT_DIR / "model" / args.output

    res = run_dataset_qc(in_p, out_p)
    print("=======================================================")
    print("           ATELIER DATASET QC REPORT                   ")
    print("=======================================================")
    print(f"Total Evaluated: {res['total']}")
    print(f"Passed Checks:   {res['passed']} ({res['pass_rate']:.1f}%)")
    print(f"Dropped:         {res['dropped']}")
    print("-------------------------------------------------------")
    for r, s in res["rule_stats"].items():
        rej_rate = (s["rejected"] / max(1, s["total"])) * 100
        status = "⚠️ REJECTED (>30%)" if rej_rate > 30 else "✓ PASS"
        print(f"  {r:16} | Total: {s['total']:3} | Rej: {s['rejected']:2} ({rej_rate:4.1f}%) -> {status}")
    print("=======================================================\n")

if __name__ == "__main__":
    main()
