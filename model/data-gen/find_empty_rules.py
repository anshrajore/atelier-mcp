import json
from pathlib import Path

data = [json.loads(line) for line in Path("model/dataset/synthetic_triples.jsonl").read_text().splitlines() if line.strip()]
for idx, d in enumerate(data):
    if "" in d.get("rule_ids", []):
        print(f"Line {idx} has empty string in rule_ids: {d}")
