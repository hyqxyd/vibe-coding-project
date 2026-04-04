from __future__ import annotations

import datetime as dt
import json
import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parents[2]
AI_COLLAB = ROOT / ".ai-collab"
FILE_MEMORY = AI_COLLAB / "FILE_MEMORY.md"
HISTORY_PATH = AI_COLLAB / "HOTSPOT_HISTORY.jsonl"


def parse_hotspots() -> list[str]:
    if not FILE_MEMORY.exists():
        return []
    hotspots: list[str] = []
    for line in FILE_MEMORY.read_text(encoding="utf-8").splitlines():
        if "|" not in line:
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if not cells or cells[0] in {"file_path", "---"}:
            continue
        if len(cells) >= 6 and cells[5].lower() == "true":
            hotspots.append(cells[0].replace("\\", "/"))
    return sorted(set(hotspots))


def append_snapshot() -> pathlib.Path:
    AI_COLLAB.mkdir(parents=True, exist_ok=True)
    now = dt.datetime.now()
    payload = {
        "timestamp": now.strftime("%Y-%m-%d %H:%M:%S"),
        "date": now.strftime("%Y-%m-%d"),
        "hotspots": parse_hotspots(),
    }
    with HISTORY_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(payload, ensure_ascii=False) + "\n")
    return HISTORY_PATH


def main() -> int:
    path = append_snapshot()
    print(str(path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
