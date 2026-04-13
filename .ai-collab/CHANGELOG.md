# AI Collaboration Changelog

## 2026-04-05 23:30 - ai - refactor/skills-extraction

- change_summary: 从主仓库中移除 skills 目录，拆分为独立仓库 vibe-coding-skills，保持项目主仓库职责单一
- ai_generated_files: 无
- api_or_schema_change: 无
- conflict_risk: low
- reviewer: human

## YYYY-MM-DD HH:mm - owner - branch

- change_summary:
- ai_generated_files:
- api_or_schema_change:
- conflict_risk:
- reviewer:

## 2026-04-13 09:35 - ai - main

- change_summary: 完成 Scenario A 稳定性收口，包括前端启动阶段状态恢复、本地持久化、后端就绪拦截与运行时初始化顺序修复。
- ai_generated_files: frontend-platform/src/App.tsx; backend-control-plane/src/main/java/com/vibecoding/controlplane/controller/ApiProxyController.java; backend-control-plane/src/main/java/com/vibecoding/controlplane/service/workspace/ApiKeyManager.java; TODO.md
- api_or_schema_change: 新增控制面代理接口 `/api/v1/gateway/chat/completions`。
- conflict_risk: medium（前端单文件 App.tsx 改动集中，需注意后续多人并行修改冲突）。
- reviewer: owner
