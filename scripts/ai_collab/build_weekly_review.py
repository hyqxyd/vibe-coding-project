from __future__ import annotations

import datetime as dt
import json
import pathlib
import re


ROOT = pathlib.Path(__file__).resolve().parents[2]
AI_COLLAB = ROOT / ".ai-collab"


def read_text(path: pathlib.Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def tail_sections(markdown_text: str, marker: str, limit: int) -> list[str]:
    lines = markdown_text.splitlines()
    selected = [line.replace(marker, "").strip() for line in lines if line.startswith(marker)]
    return selected[-limit:]


def detect_hotspots(file_memory_text: str) -> list[str]:
    rows = []
    for line in file_memory_text.splitlines():
        if "|" not in line:
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if not cells or cells[0] in {"file_path", "---"}:
            continue
        if len(cells) >= 6 and cells[5].lower() == "true":
            rows.append(cells[0])
    return rows


def detect_agent_rejects(agent_memory_text: str) -> list[str]:
    rows = []
    for line in agent_memory_text.splitlines():
        if "|" not in line:
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if not cells or cells[0] in {"agent_id", "---"}:
            continue
        if len(cells) >= 7 and cells[6].lower() == "reject":
            rows.append(f"{cells[0]} | {cells[1]} | {cells[2]}")
    return rows


def build_weekly_review() -> str:
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    changelog_text = read_text(AI_COLLAB / "CHANGELOG.md")
    team_intent_text = read_text(AI_COLLAB / "TEAM_INTENT.md")
    file_memory_text = read_text(AI_COLLAB / "FILE_MEMORY.md")
    agent_memory_text = read_text(AI_COLLAB / "AGENT_MEMORY.md")
    weekly_metrics_text = read_text(AI_COLLAB / "WEEKLY_METRICS.md")
    conflict_risk_json_text = read_text(AI_COLLAB / "CONFLICT_RISK.json")
    conflict_risk_data = {}
    if conflict_risk_json_text.strip():
        try:
            conflict_risk_data = json.loads(conflict_risk_json_text)
        except json.JSONDecodeError:
            conflict_risk_data = {}
    recent_events = tail_sections(changelog_text, "## ", 12)
    intent_bullets = [line[2:].strip() for line in team_intent_text.splitlines() if line.startswith("- ")]
    hotspots = detect_hotspots(file_memory_text)
    rejects = detect_agent_rejects(agent_memory_text)
    lines: list[str] = []
    lines.append("# Weekly AI Collaboration Review")
    lines.append("")
    lines.append(f"- generated_at: {now}")
    lines.append("")
    lines.append("## Key Timeline")
    if recent_events:
        for item in recent_events:
            lines.append(f"- {item}")
    else:
        lines.append("- no timeline event")
    lines.append("")
    lines.append("## Team Intent Snapshot")
    if intent_bullets:
        for item in intent_bullets[:20]:
            compact = re.sub(r"\s+", " ", item).strip()
            lines.append(f"- {compact}")
    else:
        lines.append("- no team intent data")
    lines.append("")
    lines.append("## Hotspot Files")
    if hotspots:
        for path in hotspots:
            lines.append(f"- {path}")
    else:
        lines.append("- no hotspot file marked true")
    lines.append("")
    lines.append("## Rejected AI Outputs")
    if rejects:
        for item in rejects:
            lines.append(f"- {item}")
    else:
        lines.append("- no reject record")
    lines.append("")
    lines.append("## Hotspot Trend Metrics")
    metric_lines = [line for line in weekly_metrics_text.splitlines() if line.startswith("- ")]
    if metric_lines:
        for line in metric_lines[:10]:
            lines.append(line)
    else:
        lines.append("- no weekly metrics data")
    lines.append("")
    lines.append("## Conflict Risk Snapshot")
    if conflict_risk_data:
        lines.append(f"- global_risk_score: {conflict_risk_data.get('global_risk_score', 0)}")
        lines.append(f"- source_rows: {conflict_risk_data.get('source_rows', 0)}")
        top_files = conflict_risk_data.get("top_files", [])
        if top_files:
            for item in top_files[:5]:
                lines.append(f"- {item.get('file', '')} | score={item.get('risk_score', 0)}")
        else:
            lines.append("- no top risk files")
    else:
        lines.append("- no conflict risk data")
    lines.append("")
    lines.append("## Next Week Actions")
    lines.append("- reduce hotspot overlap by earlier branch claim")
    lines.append("- enforce test engineer check on all source changes")
    lines.append("- update team intent snapshot after each merge window")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    output = AI_COLLAB / "WEEKLY_REVIEW.md"
    output.write_text(build_weekly_review(), encoding="utf-8")
    print(str(output))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
