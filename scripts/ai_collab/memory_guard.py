from __future__ import annotations

import argparse
import json
import pathlib
import subprocess
import sys
from dataclasses import dataclass


ROOT = pathlib.Path(__file__).resolve().parents[2]
RULES_PATH = ROOT / ".ai-collab" / "GUARD_RULES.json"
FILE_MEMORY_PATH = ROOT / ".ai-collab" / "FILE_MEMORY.md"


@dataclass
class GuardResult:
    changed_files: list[str]
    core_changed_files: list[str]
    memory_files_changed: list[str]
    hotspot_files_touched: list[str]
    passed: bool
    reasons: list[str]


def load_rules() -> dict:
    return json.loads(RULES_PATH.read_text(encoding="utf-8"))


def git_changed_files(staged_only: bool, base_ref: str | None) -> list[str]:
    if staged_only:
        cmd = ["git", "diff", "--name-only", "--cached"]
    elif base_ref:
        cmd = ["git", "diff", "--name-only", f"{base_ref}...HEAD"]
    else:
        cmd = ["git", "diff", "--name-only"]
    proc = subprocess.run(
        cmd,
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        check=False,
    )
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.strip() or "git diff failed")
    lines = [line.strip().replace("\\", "/") for line in proc.stdout.splitlines() if line.strip()]
    return sorted(set(lines))


def parse_hotspots() -> set[str]:
    if not FILE_MEMORY_PATH.exists():
        return set()
    hotspots: set[str] = set()
    for line in FILE_MEMORY_PATH.read_text(encoding="utf-8").splitlines():
        if "|" not in line:
            continue
        cells = [c.strip() for c in line.split("|")]
        if len(cells) < 8:
            continue
        file_path = cells[1] if cells[0] == "" else cells[0]
        hotspot_val = cells[6] if cells[0] == "" else cells[5]
        path_value = file_path.strip()
        if path_value in {"file_path", "---", ""}:
            continue
        if hotspot_val.lower() == "true":
            hotspots.add(path_value.replace("\\", "/"))
    return hotspots


def is_core_change(path: str, rules: dict) -> bool:
    if path in rules["core_change_files"]:
        return True
    return any(path.startswith(prefix) for prefix in rules["core_change_prefixes"])


def run_guard(staged_only: bool, block_on_hotspot: bool, base_ref: str | None) -> GuardResult:
    rules = load_rules()
    changed = git_changed_files(staged_only=staged_only, base_ref=base_ref)
    hotspots = parse_hotspots()
    core_changed = [p for p in changed if is_core_change(p, rules)]
    memory_changed = [p for p in changed if p in rules["required_memory_files"]]
    hotspot_touched = [p for p in changed if p in hotspots]
    reasons: list[str] = []
    passed = True
    if core_changed and not memory_changed:
        passed = False
        reasons.append("检测到核心改动但未更新协同记忆文件")
    if hotspot_touched and block_on_hotspot:
        passed = False
        reasons.append("检测到冲突热点文件改动，需先完成提前认领与人工复核")
    return GuardResult(
        changed_files=changed,
        core_changed_files=core_changed,
        memory_files_changed=memory_changed,
        hotspot_files_touched=hotspot_touched,
        passed=passed,
        reasons=reasons,
    )


def print_result(result: GuardResult) -> None:
    payload = {
        "passed": result.passed,
        "changed_files": result.changed_files,
        "core_changed_files": result.core_changed_files,
        "memory_files_changed": result.memory_files_changed,
        "hotspot_files_touched": result.hotspot_files_touched,
        "reasons": result.reasons,
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))


def main() -> int:
    parser = argparse.ArgumentParser(description="AI 协同记忆门禁检查")
    parser.add_argument("--staged-only", action="store_true", help="仅检查已暂存改动")
    parser.add_argument("--base-ref", default="", help="对比分支，如 origin/main")
    parser.add_argument("--allow-hotspot", action="store_true", help="允许热点文件改动不阻断")
    args = parser.parse_args()
    rules = load_rules()
    block_on_hotspot = rules.get("default_block_on_hotspot", True) and not args.allow_hotspot
    base_ref = args.base_ref.strip() or None
    try:
        result = run_guard(staged_only=args.staged_only, block_on_hotspot=block_on_hotspot, base_ref=base_ref)
    except Exception as exc:
        print(json.dumps({"passed": False, "error": str(exc)}, ensure_ascii=False, indent=2))
        return 2
    print_result(result)
    return 0 if result.passed else 1


if __name__ == "__main__":
    sys.exit(main())
