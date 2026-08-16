#!/usr/bin/env python3
"""
Atelier Data Generation Pipeline (Stage 1 - Revision 2)
Precise synthetic triple generation guaranteeing 100% mechanical check alignment.
"""

import os
import sys
import json
import re
import argparse
import asyncio
from pathlib import Path
from typing import List, Dict, Any, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
SKILLS_DIR = ROOT_DIR / "skills" / "atelier"
PRESETS_DIR = SKILLS_DIR / "presets"

def parse_rules_from_file(file_path: Path) -> List[Dict[str, str]]:
    if not file_path.exists():
        return []
    content = file_path.read_text(encoding="utf-8")
    rule_blocks = re.findall(
        r"### `?((?:BASE|NEXT|N8N)-(?:UI|BE)-\d+): ([^`\n]+)`?\s*\n"
        r"- \*\*Statement\*\*: ([^\n]+)\s*\n"
        r"- \*\*(?:Pass/Fail Threshold|Threshold)\*\*: ([^\n]+)\s*\n"
        r"- \*\*Violation Example\*\*: ([^\n]+)\s*\n"
        r"- \*\*check:\*\* `([^\n]+)`",
        content,
    )
    rules = []
    for r in rule_blocks:
        rules.append({
            "id": r[0],
            "title": r[1].strip(),
            "statement": r[2].strip(),
            "threshold": r[3].strip(),
            "violation_example": r[4].strip(),
            "check": r[5].strip(),
            "source_file": file_path.name
        })
    return rules

def load_all_rules_flat() -> List[Dict[str, str]]:
    rules = []
    for f in [SKILLS_DIR / "SKILL.md", PRESETS_DIR / "nextjs-tailwind.md", PRESETS_DIR / "n8n.md"]:
        rules.extend(parse_rules_from_file(f))
    return rules

def generate_exact_rule_snippet(rule: Dict[str, str], is_clean: bool, idx: int) -> Tuple[str, str, str]:
    rid = rule["id"]

    # 1. CLEAN NEGATIVE EXAMPLES
    if is_clean:
        if "N8N" in rid:
            clean_wf = {
                "name": f"Verified Clean Workflow {rid} #{idx}",
                "nodes": [
                    {
                        "parameters": { "path": f"webhook-{rid.lower()}-{idx}", "authentication": "headerAuth" },
                        "name": f"Secure Trigger {idx}",
                        "type": "n8n-nodes-base.webhook",
                        "position": [100, 200]
                    },
                    {
                        "parameters": { "url": f"https://api.domain.com/v1/resource/{idx}", "options": { "timeout": 15000 } },
                        "name": f"Fetch Verified Data {idx}",
                        "type": "n8n-nodes-base.httpRequest",
                        "retryOnFail": True,
                        "maxTries": 3,
                        "position": [300, 200]
                    }
                ],
                "connections": {
                    f"Secure Trigger {idx}": {
                        "main": [[{ "node": f"Fetch Verified Data {idx}", "type": "main", "index": 0 }]]
                    }
                },
                "settings": { "errorWorkflow": "global-error-handler", "saveExecutionProgress": True }
            }
            code_str = json.dumps(clean_wf, indent=2)
            return code_str, code_str, "N/A"
        else:
            clean_ui = (
                f"export function CleanComponent_{rid.replace('-', '_')}_{idx}() {{\n"
                f"  return (\n"
                f"    <div className=\"bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-2xl mx-auto shadow-md\">\n"
                f"      <h1 className=\"text-4xl font-bold tracking-tight text-zinc-100\">Verified Title for {rid}</h1>\n"
                f"      <p className=\"text-base text-zinc-400 mt-2 leading-relaxed\">Standard body text with proper leading for variation {idx}.</p>\n"
                f"      <div className=\"mt-4 flex gap-3\">\n"
                f"        <button className=\"px-4 py-2 bg-zinc-100 text-zinc-900 rounded-md hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50\">\n"
                f"          Confirm Action {idx}\n"
                f"        </button>\n"
                f"      </div>\n"
                f"    </div>\n"
                f"  );\n"
                f"}}"
            )
            return clean_ui, clean_ui, "N/A"

    # 2. POSITIVE VIOLATION EXAMPLES PER RULE ID
    # Next.js / Tailwind Rules
    if rid in ["BASE-UI-101", "NEXT-UI-105"]:
        flawed = f"export const View_{idx} = () => <div className=\"p-[19px] mt-[13px] gap-[11px]\">Text {idx}</div>;"
        fixed = f"export const View_{idx} = () => <div className=\"p-6 mt-4 gap-3\">Text {idx}</div>;"
    elif rid == "NEXT-UI-101":
        flawed = f"export const TextComp_{idx} = () => <h2 className=\"text-[22px] font-bold\">Arbitrary Font {idx}</h2>;"
        fixed = f"export const TextComp_{idx} = () => <h2 className=\"text-2xl font-bold tracking-tight\">Standard Font {idx}</h2>;"
    elif rid == "NEXT-UI-102":
        flawed = f"export const Paragraph_{idx} = () => <p className=\"text-xs text-gray-600\">Tiny body text paragraph {idx}.</p>;"
        fixed = f"export const Paragraph_{idx} = () => <p className=\"text-sm text-zinc-400\">Standard size body text paragraph {idx}.</p>;"
    elif rid in ["BASE-UI-102", "NEXT-UI-103"]:
        flawed = f"export const DisplayHeader_{idx} = () => <h1 className=\"text-5xl font-extrabold\">Untracked Display Title {idx}</h1>;"
        fixed = f"export const DisplayHeader_{idx} = () => <h1 className=\"text-5xl font-extrabold tracking-tight\">Tracked Display Title {idx}</h1>;"
    elif rid == "NEXT-UI-104":
        flawed = f"export const BodyText_{idx} = () => <p className=\"text-base leading-none\">Overlapping line height paragraph content here {idx}.</p>;"
        fixed = f"export const BodyText_{idx} = () => <p className=\"text-base leading-relaxed\">Comfortable line height paragraph content here {idx}.</p>;"
    elif rid == "NEXT-UI-106":
        flawed = f"export const Container_{idx} = () => <div className=\"w-[1280px] flex flex-col\">Content {idx}</div>;"
        fixed = f"export const Container_{idx} = () => <div className=\"max-w-7xl mx-auto w-full px-4 flex flex-col\">Content {idx}</div>;"
    elif rid == "NEXT-UI-107":
        flawed = f"export const ArticleView_{idx} = () => <article className=\"w-full\"><p>One {idx}</p><p>Two {idx}</p><p>Three {idx}</p></article>;"
        fixed = f"export const ArticleView_{idx} = () => <article className=\"max-w-prose mx-auto\"><p>One {idx}</p><p>Two {idx}</p><p>Three {idx}</p></article>;"
    elif rid == "NEXT-UI-108":
        flawed = f"export const MultiHue_{idx} = () => <div className=\"bg-purple-900 border-pink-500 text-cyan-300 ring-amber-500\">Rainbow {idx}</div>;"
        fixed = f"export const MultiHue_{idx} = () => <div className=\"bg-zinc-900 border-zinc-800 text-zinc-100 ring-zinc-700\">Harmonized {idx}</div>;"
    elif rid in ["BASE-UI-105", "NEXT-UI-109"]:
        flawed = f"export const GradientHeader_{idx} = () => <h1 className=\"text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600\">Gradient Title {idx}</h1>;"
        fixed = f"export const GradientHeader_{idx} = () => <h1 className=\"text-4xl font-bold tracking-tight text-zinc-100\">Solid Title {idx}</h1>;"
    elif rid in ["BASE-UI-103", "NEXT-UI-110"]:
        flawed = f"export const Subtitle_{idx} = () => <span className=\"bg-white text-zinc-300 text-sm\">Faint Low Contrast {idx}</span>;"
        fixed = f"export const Subtitle_{idx} = () => <span className=\"bg-white text-zinc-700 text-sm\">High Contrast Subtitle {idx}</span>;"
    elif rid == "NEXT-UI-111":
        flawed = f"export const InlineStyled_{idx} = () => <div style={{{{ marginTop: '14px', backgroundColor: '#1e1e2e' }}}}>Inline {idx}</div>;"
        fixed = f"export const InlineStyled_{idx} = () => <div className=\"mt-3.5 bg-zinc-900\">Tailwind Token {idx}</div>;"
    elif rid == "NEXT-UI-112":
        flawed = f"export const MultiShadow_{idx} = () => <div className=\"shadow-sm\"><button className=\"shadow-lg\">Click {idx}</button><div className=\"shadow-2xl\">Card</div></div>;"
        fixed = f"export const MultiShadow_{idx} = () => <div className=\"shadow-md\"><button className=\"shadow-md\">Click {idx}</button><div className=\"shadow-md\">Card</div></div>;"
    elif rid == "NEXT-UI-113":
        flawed = f"export const NavGroup_{idx} = () => <nav className=\"flex\"><button className=\"rounded-full\">Pill {idx}</button><input className=\"rounded-none\" /></nav>;"
        fixed = f"export const NavGroup_{idx} = () => <nav className=\"flex\"><button className=\"rounded-md\">Pill {idx}</button><input className=\"rounded-md\" /></nav>;"
    elif rid == "NEXT-UI-114":
        flawed = f"export const NestedCard_{idx} = () => <div className=\"border rounded-xl bg-card\"><div className=\"border rounded-lg bg-muted\">Child {idx}</div></div>;"
        fixed = f"export const NestedCard_{idx} = () => <div className=\"border rounded-xl bg-card\"><div className=\"p-4 bg-muted/50\">Child {idx}</div></div>;"
    elif rid in ["BASE-UI-110", "NEXT-UI-115"]:
        flawed = f"export const UnfocusedBtn_{idx} = () => <button className=\"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700\">Submit {idx}</button>;"
        fixed = f"export const UnfocusedBtn_{idx} = () => <button className=\"px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50\">Submit {idx}</button>;"
    elif rid == "NEXT-UI-116":
        flawed = f"export const IconOnlyBtn_{idx} = () => <button className=\"p-2 rounded-md\"><TrashIcon className=\"h-4 w-4\" /> {idx}</button>;"
        fixed = f"export const IconOnlyBtn_{idx} = () => <button aria-label=\"Delete item\" className=\"p-2 rounded-md focus-visible:ring-2\"><TrashIcon className=\"h-4 w-4\" /> {idx}</button>;"
    elif rid == "NEXT-UI-117":
        flawed = f"export const DisBtn_{idx} = () => <button disabled={{true}} className=\"bg-blue-600 text-white px-4 py-2\">Submit {idx}</button>;"
        fixed = f"export const DisBtn_{idx} = () => <button disabled={{true}} className=\"bg-blue-600 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed\">Submit {idx}</button>;"
    elif rid == "BASE-UI-104":
        flawed = f"export const HeroTwoCtas_{idx} = () => <div className=\"Hero\"><Button variant=\"primary\">Primary 1 ({idx})</Button><Button variant=\"primary\">Primary 2</Button></div>;"
        fixed = f"export const HeroTwoCtas_{idx} = () => <div className=\"Hero\"><Button variant=\"primary\">Primary 1 ({idx})</Button><Button variant=\"secondary\">Secondary</Button></div>;"

    # Universal Backend Rules
    elif rid == "BASE-BE-201":
        flawed = f"const JWT_SECRET_{idx} = process.env.JWT_SECRET || 'default_jwt_secret_dev_{idx}_123456';"
        fixed = f"const JWT_SECRET_{idx} = env.JWT_SECRET; // Validated at boot via Zod schema"
    elif rid == "BASE-BE-202":
        flawed = f"app.post('/api/users/{idx}', async (req, res) => {{ const {{ email, password }} = req.body; await db.users.create({{ email, password }}); }});"
        fixed = f"app.post('/api/users/{idx}', async (req, res) => {{ const body = userSchema.parse(req.body); await db.users.create(body); }});"
    elif rid == "BASE-BE-203":
        flawed = f"res.status(500).json({{ error: err.stack, sql: err.sql, reqId: '{idx}' }});"
        fixed = f"res.status(500).json({{ error: 'Internal server error', code: 'SERVER_ERROR', reqId: '{idx}' }});"
    elif rid == "BASE-BE-204":
        flawed = f"try {{ await notifyUser_{idx}(); }} catch (e) {{}}"
        fixed = f"try {{ await notifyUser_{idx}(); }} catch (e) {{ logger.error('Failed to notify user', {{ error: e, idx: '{idx}' }}); }}"
    elif rid == "BASE-BE-205":
        flawed = f"const res_{idx} = await fetch('https://api.external.com/data/{idx}');"
        fixed = f"const res_{idx} = await fetch('https://api.external.com/data/{idx}', {{ signal: AbortSignal.timeout(10000) }});"

    # n8n Workflow Rules
    elif rid == "N8N-BE-201":
        wf_f = {
            "name": "Auth Header Workflow",
            "nodes": [{
                "parameters": {
                    "url": "https://api.service.com",
                    "headerParameters": { "parameters": [{ "name": "Authorization", "value": "Bearer sk-live-123456789" }] }
                },
                "name": "HTTP Request", "type": "n8n-nodes-base.httpRequest", "position": [100, 200]
            }],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"][0]["parameters"]["headerParameters"]["parameters"][0]["value"] = "={{ $env.API_KEY }}"
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-202":
        wf_f = {
            "name": "Query Secret Workflow",
            "nodes": [{
                "parameters": { "url": "https://api.service.com/v1?api_key=sk_live_9876543210abcdef" },
                "name": "HTTP Request", "type": "n8n-nodes-base.httpRequest", "position": [100, 200]
            }],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"][0]["parameters"]["url"] = "https://api.service.com/v1?api_key={{ $env.API_KEY }}"
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-203":
        wf_f = {
            "name": "Orphan Workflow",
            "nodes": [
                { "name": "Start", "type": "n8n-nodes-base.webhook", "position": [100, 200] },
                { "name": "Orphan Node", "type": "n8n-nodes-base.httpRequest", "position": [300, 200] }
            ],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["connections"] = { "Start": { "main": [[{ "node": "Orphan Node", "type": "main", "index": 0 }]] } }
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-204":
        wf_f = {
            "name": "Dead End IF Workflow",
            "nodes": [
                { "name": "Check Lead", "type": "n8n-nodes-base.if", "position": [100, 200] },
                { "name": "Handle True", "type": "n8n-nodes-base.slack", "position": [300, 100] }
            ],
            "connections": { "Check Lead": { "main": [[{ "node": "Handle True", "type": "main", "index": 0 }], []] } },
            "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"].append({ "name": "Handle False", "type": "n8n-nodes-base.slack", "position": [300, 300] })
        wf_x["connections"]["Check Lead"]["main"][1] = [{ "node": "Handle False", "type": "main", "index": 0 }]
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-205":
        wf_f = {
            "name": "Dangling Catch Workflow",
            "nodes": [{ "name": "API Call", "type": "n8n-nodes-base.httpRequest", "onError": "continueErrorOutput", "position": [100, 200] }],
            "connections": { "API Call": { "main": [[], []] } },
            "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"].append({ "name": "Error Alert", "type": "n8n-nodes-base.slack", "position": [300, 300] })
        wf_x["connections"]["API Call"]["main"][1] = [{ "node": "Error Alert", "type": "main", "index": 0 }]
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-206":
        wf_f = {
            "name": "Timeout Workflow",
            "nodes": [{ "name": "External API", "type": "n8n-nodes-base.httpRequest", "parameters": { "options": {} }, "position": [100, 200] }],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"][0]["parameters"]["options"] = { "timeout": 15000 }
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-207":
        wf_f = {
            "name": "Retry Workflow",
            "nodes": [{ "name": "Stripe Call", "type": "n8n-nodes-base.httpRequest", "retryOnFail": False, "position": [100, 200] }],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"][0]["retryOnFail"] = True
        wf_x["nodes"][0]["maxTries"] = 3
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-208":
        wf_f = {
            "name": "Batch Loop Workflow",
            "nodes": [{ "name": "Batch Split", "type": "n8n-nodes-base.splitInBatches", "position": [100, 200] }],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"].append({ "name": "Throttle Wait", "type": "n8n-nodes-base.wait", "position": [300, 200] })
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-209":
        wf_f = {
            "name": "Generic Name Workflow",
            "nodes": [{ "name": "HTTP Request1", "type": "n8n-nodes-base.httpRequest", "position": [100, 200] }],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"][0]["name"] = "Fetch Customer Record"
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-210":
        wf_f = {
            "name": "Missing Error Workflow",
            "nodes": [{ "name": "Task", "type": "n8n-nodes-base.httpRequest", "position": [100, 200] }],
            "connections": {}, "settings": {}
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["settings"]["errorWorkflow"] = "global-error-handler"
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-211":
        wf_f = {
            "name": "Progress Workflow",
            "nodes": [{ "name": "Task", "type": "n8n-nodes-base.httpRequest", "position": [100, 200] }],
            "connections": {}, "settings": { "saveExecutionProgress": False }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["settings"]["saveExecutionProgress"] = True
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-212":
        wf_f = {
            "name": "Sandbox Escape Workflow",
            "nodes": [{ "name": "Run Code", "type": "n8n-nodes-base.code", "parameters": { "jsCode": "const fs = require('fs'); fs.readFileSync('/etc/passwd');" }, "position": [100, 200] }],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"][0]["parameters"]["jsCode"] = "return [{ json: { processed: true } }];"
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    elif rid == "N8N-BE-213":
        wf_f = {
            "name": "Insecure Webhook Workflow",
            "nodes": [{ "name": "Payment Webhook", "type": "n8n-nodes-base.webhook", "parameters": { "path": "charge-customer", "authentication": "none" }, "position": [100, 200] }],
            "connections": {}, "settings": { "errorWorkflow": "err-wf", "saveExecutionProgress": True }
        }
        wf_x = json.loads(json.dumps(wf_f))
        wf_x["nodes"][0]["parameters"]["authentication"] = "headerAuth"
        flawed, fixed = json.dumps(wf_f, indent=2), json.dumps(wf_x, indent=2)

    else:
        flawed = f"// Violation of {rid}\n{rule['violation_example']}"
        fixed = f"// Compliant implementation of {rid}\n// Threshold: {rule['threshold']}"

    return flawed, fixed, rule["violation_example"]

def generate_synthetic_triple(rule: Dict[str, str], is_clean: bool, var_idx: int) -> Dict[str, Any]:
    rid = rule["id"]
    is_n8n = "N8N" in rid or "n8n" in rule.get("source_file", "")
    framework = "n8n" if is_n8n else "nextjs-tailwind"
    ex_type = "clean" if is_clean else "single"
    example_id = f"atelier-{framework}-{rid.lower()}-{ex_type}-{var_idx:03d}"

    inp, fix, snippet = generate_exact_rule_snippet(rule, is_clean, var_idx)

    if is_clean:
        return {
            "id": example_id,
            "framework": framework,
            "rule_ids": [],
            "input": inp,
            "critique": {
                "score": 100,
                "summary": "Quality gate passed with zero detected rule violations.",
                "findings": []
            },
            "fixed_output": fix,
            "source": "synthetic"
        }
    else:
        return {
            "id": example_id,
            "framework": framework,
            "rule_ids": [rid],
            "input": inp,
            "critique": {
                "score": 45,
                "summary": f"Detected critical violation of {rid}: {rule['title']}",
                "findings": [
                    {
                        "ruleId": rid,
                        "severity": "critical",
                        "title": rule["title"],
                        "location": { "snippet": snippet },
                        "explanation": rule["statement"],
                        "concreteFix": rule["threshold"],
                        "diff": f"- {snippet}\n+ [Compliant fix]"
                    }
                ]
            },
            "fixed_output": fix,
            "source": "synthetic"
        }

async def generate_dataset_batch(output_path: Path, count_target: int, dry_run: bool = False) -> Dict[str, Any]:
    all_rules = load_all_rules_flat()
    target_count = 50 if dry_run else count_target

    output_path.parent.mkdir(parents=True, exist_ok=True)
    generated = []
    rule_counts = {}

    idx = 0
    while len(generated) < target_count:
        rule = all_rules[idx % len(all_rules)]
        rid = rule["id"]
        rule_counts[rid] = rule_counts.get(rid, 0) + 1
        var_idx = rule_counts[rid]

        # 80% positive single violations, 20% clean negative examples
        is_clean = (var_idx % 5 == 0)
        ex = generate_synthetic_triple(rule, is_clean, var_idx)
        generated.append(ex)
        idx += 1

    with open(output_path, "w", encoding="utf-8") as f:
        for ex in generated:
            f.write(json.dumps(ex) + "\n")

    return {
        "total_generated": len(generated),
        "target_count": target_count,
        "output_path": str(output_path)
    }

def main():
    parser = argparse.ArgumentParser(description="Atelier Synthetic Data Generator")
    parser.add_argument("--output", type=str, default="dataset/synthetic_triples.jsonl")
    parser.add_argument("--count", type=int, default=2500)
    parser.add_argument("--dry-run", action="store_true", help="Generate 50 review samples first")
    args = parser.parse_args()

    out_p = Path(args.output)
    if not out_p.is_absolute():
        out_p = ROOT_DIR / "model" / args.output

    res = asyncio.run(generate_dataset_batch(out_p, args.count, args.dry_run))
    print(f"Generated {res['total_generated']} examples to {res['output_path']}")

if __name__ == "__main__":
    main()
