from __future__ import annotations

import datetime as dt
import json
import pathlib
from collections import Counter


ROOT = pathlib.Path(__file__).resolve().parents[2]
AI_COLLAB = ROOT / ".ai-collab"
HISTORY_PATH = AI_COLLAB / "HOTSPOT_HISTORY.jsonl"
OUTPUT_PATH = AI_COLLAB / "WEEKLY_METRICS.md"


def load_history() -> list[dict]:
    if not HISTORY_PATH.exists():
        return []
    rows: list[dict] = []
    for line in HISTORY_PATH.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return rows


def build_metrics_markdown() -> str:
    rows = load_history()
    today = dt.date.today()
    last7 = today - dt.timedelta(days=6)
    recent = []
    for row in rows:
        try:
            d = dt.datetime.strptime(row.get("date", ""), "%Y-%m-%d").date()
        except ValueError:
            continue
        if d >= last7:
            recent.append(row)
    counter = Counter()
    non_empty_days = set()
    for row in recent:
        hotspots = row.get("hotspots", []) or []
        if hotspots:
            non_empty_days.add(row.get("date"))
        for p in hotspots:
            counter[p] += 1
    lines: list[str] = []
    lines.append("# Weekly Hotspot Metrics")
    lines.append("")
    lines.append(f"- generated_at: {dt.datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append(f"- window: {last7} ~ {today}")
    lines.append(f"- snapshot_count: {len(recent)}")
    lines.append(f"- hotspot_active_days: {len(non_empty_days)}")
    lines.append(f"- unique_hotspot_files: {len(counter)}")
    lines.append("")
    lines.append("## Top Hotspot Files")
    if not counter:
        lines.append("- no hotspot data in last 7 days")
    else:
        for path, cnt in counter.most_common(10):
            lines.append(f"- {path}: {cnt}")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    AI_COLLAB.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(build_metrics_markdown(), encoding="utf-8")
    print(str(OUTPUT_PATH))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
