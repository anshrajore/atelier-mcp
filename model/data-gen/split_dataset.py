#!/usr/bin/env python3
"""
Split validated_triples.jsonl into train/val/test with guaranteed rule coverage.
Output: model/dataset/train.jsonl (90%), val.jsonl (5%), test.jsonl (5%)
"""
import json, random, collections
from pathlib import Path

random.seed(42)

src = Path("model/dataset/validated_triples.jsonl")
examples = [json.loads(l) for l in src.read_text().splitlines() if l.strip()]

# Group by rule_id (use first rule if multi-rule, or "CLEAN_NEGATIVE")
by_rule: dict[str, list] = collections.defaultdict(list)
for ex in examples:
    rule_ids = ex.get("rule_ids", [])
    key = rule_ids[0] if rule_ids else "CLEAN_NEGATIVE"
    by_rule[key].append(ex)

train, val, test = [], [], []

for rule, items in by_rule.items():
    random.shuffle(items)
    n = len(items)
    n_val  = max(1, round(n * 0.05))
    n_test = max(1, round(n * 0.05))
    n_train = n - n_val - n_test
    train += items[:n_train]
    val   += items[n_train:n_train + n_val]
    test  += items[n_train + n_val:]

random.shuffle(train)

out = Path("model/dataset")
out.mkdir(parents=True, exist_ok=True)

for name, split in [("train", train), ("val", val), ("test", test)]:
    (out / f"{name}.jsonl").write_text("\n".join(json.dumps(e) for e in split))

print(f"Split complete:")
print(f"  train: {len(train):,} examples")
print(f"  val:   {len(val):,} examples")
print(f"  test:  {len(test):,} examples")
print(f"  total: {len(train)+len(val)+len(test):,} examples")
