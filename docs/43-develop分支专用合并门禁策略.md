# develop 分支专用合并门禁策略

## 1. 目标

本策略用于 `develop` 分支，确保其长期可集成、可回归、可发布到 `main`。

## 2. 适用范围

- 所有合并到 `develop` 的 PR
- 所有直接推送到 `develop` 的紧急修复

## 3. 门禁分层

## 3.1 L1 基础门禁（必须通过）

- 提交信息符合 `type(scope): subject`
- `memory_guard` 通过
- `ai_test_engineer_check` 通过
- PR 模板字段完整

## 3.2 L2 协同门禁（必须通过）

- `BRANCH_REGISTRY.md` 更新
- `CHANGELOG.md` 更新
- `FILE_MEMORY.md` 或 `AGENT_MEMORY.md` 至少一项更新
- 热点文件改动具备复核记录

## 3.3 L3 质量门禁（建议阻断）

- lint 通过
- typecheck 通过
- 测试通过
- 若有接口变更，契约文档与页面映射文档同步变更

## 4. develop 分支规则

- 禁止绕过 PR 直接提交（紧急修复除外）
- 紧急修复必须在 24 小时内补充完整记忆与复盘记录
- 每日仅在固定窗口执行批量合并

## 5. 合并窗口策略

- 窗口 A：12:00 - 12:30
- 窗口 B：18:00 - 18:30

窗口前必须：

1. `rebase develop`
2. 运行本地门禁脚本
3. 确认冲突风险评分

## 6. 推荐命令

```bash
python scripts/ai_collab/memory_guard.py --base-ref origin/main
python scripts/ai_collab/ai_test_engineer_check.py --base-ref origin/main
python scripts/ai_collab/build_team_intent.py
python scripts/ai_collab/snapshot_hotspot_history.py
python scripts/ai_collab/build_weekly_metrics.py
python scripts/ai_collab/build_weekly_review.py
```

## 7. 升级触发

出现以下任一情况时，升级为“强同步审查”：

- 热点文件冲突连续两周上升
- AI reject 记录连续增加
- 回滚率高于团队阈值

## 8. 验收指标

- develop 合并阻塞时长下降
- 热点冲突文件数量下降
- 首轮 PR 通过率提升
- 由协同失配导致的问题单下降
