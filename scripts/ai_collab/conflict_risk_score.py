from __future__ import annotations

import datetime as dt
import json
import pathlib
from collections import Counter


ROOT = pathlib.Path(__file__).resolve().parents[2]
AI_COLLAB = ROOT / ".ai-collab"
HISTORY_PATH = AI_COLLAB / "HOTSPOT_HISTORY.jsonl"
CHANGELOG_PATH = AI_COLLAB / "CHANGELOG.md"
OUTPUT_MD = AI_COLLAB / "CONFLICT_RISK.md"
OUTPUT_JSON = AI_COLLAB / "CONFLICT_RISK.json"


def load_hotspot_history() -> list[dict]:
    if not HISTORY_PATH.exists():
        return []
    rows = []
    for line in HISTORY_PATH.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return rows


def changelog_intensity() -> int:
    if not CHANGELOG_PATH.exists():
        return 0
    return len([line for line in CHANGELOG_PATH.read_text(encoding="utf-8").splitlines() if line.startswith("## ")])


def compute_scores() -> dict:
    rows = load_hotspot_history()
    counter = Counter()
    overlap_counter = Counter()
    for row in rows:
        hotspots = row.get("hotspots", [])
        for p in hotspots:
            counter[p] += 1
        if len(hotspots) >= 2:
            for p in hotspots:
                overlap_counter[p] += 1
    intensity = changelog_intensity()
    file_scores = {}
    for path, freq in counter.items():
        overlap = overlap_counter.get(path, 0)
        score = min(100, freq * 8 + overlap * 5 + min(20, intensity))
        file_scores[path] = {
            "frequency": freq,
            "overlap": overlap,
            "risk_score": score,
        }
    ranked = sorted(file_scores.items(), key=lambda x: x[1]["risk_score"], reverse=True)
    top = [{"file": k, **v} for k, v in ranked[:10]]
    global_score = 0
    if top:
        global_score = round(sum(item["risk_score"] for item in top) / len(top), 2)
    return {
        "generated_at": dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "global_risk_score": global_score,
        "top_files": top,
        "source_rows": len(rows),
        "changelog_intensity": intensity,
    }


def write_outputs(payload: dict) -> None:
    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    lines = []
    lines.append("# Conflict Risk Score")
    lines.append("")
    lines.append(f"- generated_at: {payload['generated_at']}")
    lines.append(f"- global_risk_score: {payload['global_risk_score']}")
    lines.append(f"- source_rows: {payload['source_rows']}")
    lines.append(f"- changelog_intensity: {payload['changelog_intensity']}")
    lines.append("")
    lines.append("## Top Risk Files")
    if not payload["top_files"]:
        lines.append("- no risk file data")
    else:
        for item in payload["top_files"]:
            lines.append(f"- {item['file']} | score={item['risk_score']} | freq={item['frequency']} | overlap={item['overlap']}")
    lines.append("")
    OUTPUT_MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    AI_COLLAB.mkdir(parents=True, exist_ok=True)
    payload = compute_scores()
    write_outputs(payload)
    print(json.dumps({"passed": True, "global_risk_score": payload["global_risk_score"], "path": str(OUTPUT_JSON)}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
