---
name: ai-collab-governance
description: 多人协同 + AI Coding 治理技能。用户提到“多人协作、分支冲突、合并节奏、提交规范、代码不同步、AI改了什么、怎么让团队都知道变更、PR流程、门禁策略、主干开发”时必须触发。用于建立可执行的分支策略、提交规范、冲突预防、AI变更记忆与合并机制。
---

# AI Collaboration Governance

## 1. 目标

在多人协作场景下，输出一套可执行协同机制，确保：

- 分支清晰
- 变更可追溯
- AI 改动可审计
- 合并稳定可控

## 2. 执行流程

1. 识别团队规模与模块边界
2. 产出分支模型与命名规则
3. 产出提交规范与 PR 模板
4. 产出 AI 变更记忆机制
5. 产出合并窗口与冲突处理规则
6. 产出上线前门禁清单

## 3. 输出结构

始终输出以下 6 段：

1. 分支策略
2. 提交规范
3. AI 协同记忆
4. PR 与评审机制
5. 合并与发布机制
6. 风险与治理建议

## 4. 提交规范模板

默认使用：

`type(scope): subject`

允许类型：

- feat
- fix
- refactor
- perf
- docs
- test
- build
- ci
- chore
- revert

## 5. AI 变更记忆要求

每次功能迭代必须记录：

- 变更目标
- AI 改动文件
- 对外接口变更
- 风险点
- 人工复核结论

## 6. 冲突预防规则

- 功能分支按模块分片，禁止跨模块大包改动
- 每半天同步一次 develop
- 固定合并窗口，非窗口仅允许紧急修复
- 冲突超过阈值必须拆分 PR

## 7. 评审规则

- AI 生成代码必须标记关键人工复核点
- PR 必须包含回滚方案
- 不允许“仅 AI 自证通过”直接合并

## 8. 最低落地物

至少生成并维护：

- `BRANCH_REGISTRY.md`
- `CHANGELOG.md`
- `MERGE_WINDOW.md`
- `pull_request_template.md`
- `commit-msg` 校验钩子

## 9. v0.2 自动化门禁

协同方案升级时，必须给出自动化脚本落地方案：

- `memory_guard.py`：检查核心改动是否同步更新协同记忆
- `memory_guard.py`：命中冲突热点文件时输出阻断或预警
- `build_team_intent.py`：生成团队意图快照供 AI 复核使用

并输出最小执行命令：

- `python scripts/ai_collab/memory_guard.py --staged-only`
- `python scripts/ai_collab/build_team_intent.py`

## 10. Harness 复核要求

输出协同机制时必须包含三类 AI 角色：

- AI Builder
- AI Reviewer
- AI Test Engineer

并明确 Human Owner 的最终合并决策责任。
