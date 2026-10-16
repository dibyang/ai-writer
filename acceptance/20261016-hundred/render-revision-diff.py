"""Read-only, sentence-level review material; never an automatic semantic pass."""
import difflib
import hashlib
import json
from pathlib import Path
import re
import sys
from collections import defaultdict

sys.stdout.reconfigure(encoding="utf-8")
base = Path(__file__).resolve().parent
source = Path(sys.argv[1]).resolve()
if base not in source.parents:
    raise ValueError("Input must stay in this campaign")
target = source.with_name(source.stem + "-sentence-diff")
data = json.loads(source.read_text(encoding="utf-8"))
values = {row["id"]: row for row in data["values"]}
patches = []
intern = {}
cache = {}

def value(row):
    if not row["defined"]:
        return "[字段缺失]"
    return row["value"] if isinstance(row["value"], str) else json.dumps(row["value"], ensure_ascii=False)

def split(text):
    return [part for part in re.split(r"(?<=[。；;！？!\n])", text) if part]

for row in data["rows"]:
    pair = (row["before"], row["after"])
    if pair not in cache:
        old, new = split(value(values[pair[0]])), split(value(values[pair[1]]))
        entries = []
        for tag, i, j, a, b in difflib.SequenceMatcher(a=old, b=new, autojunk=False).get_opcodes():
            if tag == "equal":
                continue
            patch = {"old": "".join(old[i:j]), "new": "".join(new[a:b]),
                     "old_context_before": "".join(old[max(0, i-1):i]),
                     "old_context_after": "".join(old[j:j+1]),
                     "new_context_before": "".join(new[max(0, a-1):a]),
                     "new_context_after": "".join(new[b:b+1])}
            key = json.dumps(patch, ensure_ascii=False, sort_keys=True)
            if key not in intern:
                intern[key] = len(patches)
                patches.append({"id": len(patches), **patch, "locations": []})
            entries.append(intern[key])
        cache[pair] = entries
    for index in cache[pair]:
        patches[index]["locations"].append({"unit": row["unit"], "field": row["field"], "before": row["before"], "after": row["after"]})

report = {"scope": "Sentence differences and exact unit-field bindings for model reading; unchanged portions are mechanically equal, not re-read or approved", "source_sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "source_rows": len(data["rows"]), "patches": patches}
with target.with_suffix(".json").open("x", encoding="utf-8", newline="\n") as stream:
    json.dump(report, stream, ensure_ascii=False, indent=2)
    stream.write("\n")
lines = ["# 逐句差异阅读材料", "", report["scope"], "", f"源变化单元格：{len(data['rows'])}；去重差异组：{len(patches)}。", ""]
def wrapped(label, text):
    lines.append(label)
    lines.extend(text[n:n+120] for n in range(0, len(text), 120))
    if not text:
        lines.append("[空]")
    lines.append("")
for patch in patches:
    lines.extend([f"## 差异 {patch['id']}", ""])
    fields = defaultdict(set)
    for location in patch["locations"]:
        fields[location["field"]].add(location["unit"])
    for field, units in fields.items():
        wrapped("绑定字段：" + field, "单元：" + ",".join(str(n) for n in sorted(units)))
    for key, title in [("old_context_before", "旧前句"), ("old", "改前"), ("old_context_after", "旧后句"), ("new_context_before", "新前句"), ("new", "改后"), ("new_context_after", "新后句")]:
        wrapped(title, patch[key])
with target.with_suffix(".md").open("x", encoding="utf-8", newline="\n") as stream:
    stream.write("\n".join(lines) + "\n")
print(json.dumps({"source": str(source), "rows": len(data["rows"]), "patches": len(patches), "markdown_bytes": target.with_suffix(".md").stat().st_size}, ensure_ascii=False))
