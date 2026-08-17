#!/usr/bin/env python3
"""
Convert Atelier triples (JSONL) -> MLX-LM chat format.
Output: model/dataset/mlx_train.jsonl, mlx_val.jsonl
Each line: {"text": "<s>[INST] ... [/INST] ... </s>"}
"""
import json
from pathlib import Path

SYSTEM_PROMPT = (
    "You are Atelier, a post-generation code quality critic. "
    "You audit code for UI/UX and backend violations against the Atelier ruleset. "
    "When given code, identify violations, cite the rule ID, explain the issue concisely, "
    "and provide a concrete corrected version."
)

def triple_to_chat(ex: dict) -> dict:
    rule_ids = ex.get("rule_ids", [])
    inp = ex.get("input", "").strip()
    critique = ex.get("critique", {})
    fixed = ex.get("fixed_output", "").strip()

    framework = ex.get("framework", "general")
    user_msg = f"Review this {framework} code for Atelier ruleset violations:\n\n```\n{inp}\n```"

    findings = critique.get("findings", [])
    score = critique.get("score", 100)

    if not rule_ids or not findings:
        assistant_msg = (
            f"**Score: {score}/100 — No violations detected.**\n\n"
            "This code passes all applicable Atelier rules. No changes required."
        )
    else:
        lines = [f"**Score: {score}/100**\n"]
        for f in findings:
            rid = f.get("ruleId", rule_ids[0] if rule_ids else "?")
            title = f.get("title", rid)
            sev = f.get("severity", "warning").upper()
            explanation = f.get("explanation", "")
            fix_desc = f.get("concreteFix", "")
            diff = f.get("diff", "")
            lines.append(f"### ❌ `{rid}` — {title} [{sev}]")
            if explanation:
                lines.append(f"**Issue**: {explanation}")
            if fix_desc:
                lines.append(f"**Fix**: {fix_desc}")
            if diff:
                lines.append(f"```diff\n{diff}\n```")
        lines.append(f"\n**Corrected code:**\n```\n{fixed}\n```")
        assistant_msg = "\n".join(lines)

    # Return mlx-lm chat format — enables prompt masking
    return {
        "messages": [
            {"role": "system",    "content": SYSTEM_PROMPT},
            {"role": "user",      "content": user_msg},
            {"role": "assistant", "content": assistant_msg},
        ]
    }


def convert(input_path: Path, output_path: Path):
    """Read triples-format JSONL, write mlx-lm chat-messages JSONL."""
    examples = [json.loads(l) for l in input_path.read_text().splitlines() if l.strip()]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    converted = 0
    with open(output_path, "w") as f:
        for ex in examples:
            chat = triple_to_chat(ex)  # returns {"messages": [...]}
            f.write(json.dumps(chat) + "\n")
            converted += 1
    print(f"  Converted {converted:,} examples -> {output_path}")
    # Stats: count words in the assistant response (what the model learns to produce)
    records = [json.loads(l) for l in output_path.read_text().splitlines() if l.strip()]
    assistant_lengths = [
        len(msg["content"].split())
        for r in records
        for msg in r["messages"]
        if msg["role"] == "assistant"
    ]
    if assistant_lengths:
        print(f"  Assistant response words — Avg: {sum(assistant_lengths)//len(assistant_lengths)}, "
              f"Max: {max(assistant_lengths)}, Min: {min(assistant_lengths)}")


if __name__ == "__main__":
    src = Path("model/dataset")       # triples-format splits (original data)
    dst = Path("model/dataset/mlx")   # mlx-lm training dir (separate to avoid clobbering)

    # mlx-lm expects exactly: {data_dir}/train.jsonl, valid.jsonl, test.jsonl
    print("Converting train split...")
    convert(src / "train.jsonl", dst / "train.jsonl")
    print("Converting val split...")
    convert(src / "val.jsonl", dst / "valid.jsonl")   # note: mlx-lm wants "valid" not "val"
    print("Converting test split...")
    convert(src / "test.jsonl", dst / "test.jsonl")
    print(f"\nDone. MLX datasets in {dst}/")

