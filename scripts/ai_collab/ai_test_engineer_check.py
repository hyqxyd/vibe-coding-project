from __future__ import annotations

import argparse
import json
import pathlib
import subprocess
import sys


ROOT = pathlib.Path(__file__).resolve().parents[2]


def run_git_diff_name_only(base_ref: str | None, staged_only: bool) -> list[str]:
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
    return sorted(
        set(
            line.strip().replace("\\", "/")
            for line in proc.stdout.splitlines()
            if line.strip()
        )
    )


def is_source_file(path: str) -> bool:
    return path.startswith("frontend/") or path.startswith("backend/")


def is_test_file(path: str) -> bool:
    lowered = path.lower()
    return (
        "/test" in lowered
        or "/tests" in lowered
        or lowered.endswith(".spec.ts")
        or lowered.endswith(".spec.tsx")
        or lowered.endswith(".test.ts")
        or lowered.endswith(".test.tsx")
        or lowered.endswith("_test.py")
        or lowered.endswith("test_.py")
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="AI Test Engineer correctness gate")
    parser.add_argument("--base-ref", default="", help="对比分支，如 origin/main")
    parser.add_argument("--staged-only", action="store_true", help="仅检查暂存改动")
    parser.add_argument("--allow-no-tests", action="store_true", help="允许本次改动不包含测试变更")
    args = parser.parse_args()
    base_ref = args.base_ref.strip() or None
    try:
        changed_files = run_git_diff_name_only(base_ref=base_ref, staged_only=args.staged_only)
    except Exception as exc:
        print(json.dumps({"passed": False, "error": str(exc)}, ensure_ascii=False, indent=2))
        return 2
    source_files = [f for f in changed_files if is_source_file(f)]
    test_files = [f for f in changed_files if is_test_file(f)]
    contract_doc_changed = "docs/11-教师端接口契约.md" in changed_files
    page_map_changed = "docs/31-页面到接口映射表.md" in changed_files
    reasons: list[str] = []
    passed = True
    if source_files and not test_files and not args.allow_no_tests:
        passed = False
        reasons.append("检测到前后端源码改动，但未检测到测试文件改动")
    if contract_doc_changed ^ page_map_changed:
        passed = False
        reasons.append("接口契约文档与页面接口映射文档需要同步变更")
    payload = {
        "passed": passed,
        "changed_files": changed_files,
        "source_files": source_files,
        "test_files": test_files,
        "contract_doc_changed": contract_doc_changed,
        "page_map_changed": page_map_changed,
        "reasons": reasons,
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    return 0 if passed else 1


if __name__ == "__main__":
    raise SystemExit(main())
