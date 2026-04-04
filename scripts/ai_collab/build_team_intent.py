from __future__ import annotations

import datetime as dt
import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parents[2]
AI_COLLAB = ROOT / ".ai-collab"


def read_lines(path: pathlib.Path) -> list[str]:
    if not path.exists():
        return []
    return path.read_text(encoding="utf-8").splitlines()


def parse_markdown_table(path: pathlib.Path) -> list[list[str]]:
    rows: list[list[str]] = []
    for line in read_lines(path):
        if "|" not in line:
            continue
        cells = [c.strip() for c in line.split("|")[1:-1]]
        if not cells:
            continue
        if all(c in {"---", ":---", "---:"} for c in cells):
            continue
        if "Owner" in cells[0] or "agent_id" in cells[0] or "file_path" in cells[0]:
            continue
        rows.append(cells)
    return rows


def parse_changelog(path: pathlib.Path) -> list[str]:
    items: list[str] = []
    for line in read_lines(path):
        if line.startswith("## "):
            items.append(line.replace("## ", "").strip())
    return items


def build_intent_markdown() -> str:
    branch_rows = parse_markdown_table(AI_COLLAB / "BRANCH_REGISTRY.md")
    file_rows = parse_markdown_table(AI_COLLAB / "FILE_MEMORY.md")
    agent_rows = parse_markdown_table(AI_COLLAB / "AGENT_MEMORY.md")
    changelog_heads = parse_changelog(AI_COLLAB / "CHANGELOG.md")
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M")
    lines: list[str] = []
    lines.append("# Team Intent Snapshot")
    lines.append("")
    lines.append(f"- generated_at: {now}")
    lines.append("")
    lines.append("## Active Branch Intent")
    if not branch_rows:
        lines.append("- no branch entries")
    else:
        for row in branch_rows[:20]:
            owner = row[0] if len(row) > 0 else ""
            branch = row[1] if len(row) > 1 else ""
            module = row[2] if len(row) > 2 else ""
            status = row[5] if len(row) > 5 else ""
            lines.append(f"- {owner} | {branch} | module={module} | status={status}")
    lines.append("")
    lines.append("## High Risk File Focus")
    hotspots = []
    for row in file_rows:
        file_path = row[0] if len(row) > 0 else ""
        hotspot = (row[5] if len(row) > 5 else "").lower()
        intent = row[2] if len(row) > 2 else ""
        if hotspot == "true":
            hotspots.append((file_path, intent))
    if not hotspots:
        lines.append("- no hotspot file marked true")
    else:
        for file_path, intent in hotspots:
            lines.append(f"- {file_path} | intent={intent}")
    lines.append("")
    lines.append("## AI Session Intent")
    if not agent_rows:
        lines.append("- no agent memory entries")
    else:
        for row in agent_rows[:30]:
            agent = row[0] if len(row) > 0 else ""
            branch = row[1] if len(row) > 1 else ""
            goal = row[2] if len(row) > 2 else ""
            status = row[6] if len(row) > 6 else ""
            lines.append(f"- {agent} | {branch} | goal={goal} | validation={status}")
    lines.append("")
    lines.append("## Recent Sync Events")
    if not changelog_heads:
        lines.append("- no changelog timeline entry")
    else:
        for head in changelog_heads[-10:]:
            clean = re.sub(r"\s+", " ", head).strip()
            lines.append(f"- {clean}")
    lines.append("")
    lines.append("## Reviewer Brief")
    lines.append("- review first: hotspot files, schema/api changes, failed validations")
    lines.append("- reject merge when memory files are stale or missing")
    lines.append("- ensure each ai-generated change has human validation outcome")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    output_path = AI_COLLAB / "TEAM_INTENT.md"
    output_path.write_text(build_intent_markdown(), encoding="utf-8")
    print(str(output_path))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
