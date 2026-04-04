from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib
import uuid


ROOT = pathlib.Path(__file__).resolve().parents[2]
AI_COLLAB = ROOT / ".ai-collab"
EVENTS_PATH = AI_COLLAB / "MEMORY_EVENTS.jsonl"
SCHEMA_PATH = AI_COLLAB / "MEMORY_EVENTS.schema.json"


def parse_csv(value: str) -> list[str]:
    if not value.strip():
        return []
    return [x.strip() for x in value.split(",") if x.strip()]


def validate_event(event: dict) -> tuple[bool, list[str]]:
    schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
    errors: list[str] = []
    required = schema.get("required", [])
    for key in required:
        if key not in event:
            errors.append(f"missing required field: {key}")
    event_type_enum = schema["properties"]["event_type"]["enum"]
    if event.get("event_type") not in event_type_enum:
        errors.append("invalid event_type")
    risk_level_enum = schema["properties"]["risk"]["properties"]["level"]["enum"]
    risk_level = event.get("risk", {}).get("level")
    if risk_level not in risk_level_enum:
        errors.append("invalid risk.level")
    actor_type_enum = schema["properties"]["actor"]["properties"]["type"]["enum"]
    actor_type = event.get("actor", {}).get("type")
    if actor_type not in actor_type_enum:
        errors.append("invalid actor.type")
    score = event.get("risk", {}).get("score")
    if score is not None and not (0 <= score <= 100):
        errors.append("risk.score out of range")
    return (len(errors) == 0, errors)


def build_event(args: argparse.Namespace) -> dict:
    now = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    event = {
        "event_id": args.event_id or f"evt_{uuid.uuid4().hex[:12]}",
        "event_type": args.event_type,
        "timestamp": now,
        "branch": args.branch,
        "actor": {
            "type": args.actor_type,
            "id": args.actor_id,
        },
        "summary": args.summary,
        "files": parse_csv(args.files),
        "risk": {
            "level": args.risk_level,
            "tags": parse_csv(args.risk_tags),
            "score": args.risk_score,
        },
        "validation": {
            "human_review": args.human_review,
            "test_status": args.test_status,
        },
        "metadata": {
            "source": args.source,
            "request_id": args.request_id,
        },
    }
    return event


def main() -> int:
    parser = argparse.ArgumentParser(description="write ai collab memory event")
    parser.add_argument("--event-id", default="")
    parser.add_argument("--event-type", required=True)
    parser.add_argument("--branch", required=True)
    parser.add_argument("--actor-type", required=True)
    parser.add_argument("--actor-id", required=True)
    parser.add_argument("--summary", required=True)
    parser.add_argument("--files", default="")
    parser.add_argument("--risk-level", default="low")
    parser.add_argument("--risk-tags", default="")
    parser.add_argument("--risk-score", type=float, default=0)
    parser.add_argument("--human-review", default="pending")
    parser.add_argument("--test-status", default="unknown")
    parser.add_argument("--source", default="manual")
    parser.add_argument("--request-id", default="")
    args = parser.parse_args()
    AI_COLLAB.mkdir(parents=True, exist_ok=True)
    event = build_event(args)
    ok, errors = validate_event(event)
    if not ok:
        print(json.dumps({"passed": False, "errors": errors}, ensure_ascii=False, indent=2))
        return 1
    with EVENTS_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False) + "\n")
    print(json.dumps({"passed": True, "path": str(EVENTS_PATH), "event_id": event["event_id"]}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
