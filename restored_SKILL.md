---
name: ai-collab-governance
description: 多人协同 + AI Coding 治理与项目进程管理技能。用户提到“多人协作、分支冲突、代办事项、TODO、项目进程、更新代办、提交规范、AI改了什么”时必须触发。用于建立可执行的分支策略、项目进度追踪（TODO.md）、冲突预防、AI变更记忆与合并机制。
---

# AI Collaboration Governance & Project Tracking

## 1. 目标

在多人协作场景下，输出一套可执行的协同与进度管理机制，确保：

- 分支清晰
- 变更可追溯
- 项目进度透明（Single Source of Truth）
- AI 改动可审计
- 合并稳定可控

## 2. 执行流程

1. 识别团队规模与模块边界
2. 建立或更新项目全局 `TODO.md` 代办事项
3. 产出分支模型与命名规则
4. 产出提交规范与 PR 模板
5. 产出 AI 变更记忆机制
6. 产出合并窗口与冲突处理规则
7. 产出上线前门禁清单

## 3. 输出结构

始终输出以下 7 段：

1. 项目进程管理规范 (TODO.md)
2. 分支策略
3. 提交规范
4. AI 协同记忆
5. PR 与评审机制
6. 合并与发布机制
7. 风险与治理建议

## 4. 项目进程与 TODO.md 管理规范

项目必须维护根目录下的 `TODO.md` 作为项目状态的单一真实来源：

- **主动更新**：每次接受新需求、开启新 Sprint、或完成一项任务后，必须及时更新 `TODO.md` 中的状态。
- **状态标记**：从未完成 `[ ]` 更新为进行中 `[-]`，或完成 `[x]`。
- **删除与归档**：对于已废弃的任务需及时删除或移入归档区，避免进程混乱。
- **任务拆分**：大的需求必须在 `TODO.md` 中拆分为可执行的子任务。

## 5. 提交规范模板

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

## 6. AI 变更记忆要求

每次功能迭代必须记录：

- 变更目标
- AI 改动文件
- 对外接口变更
- 风险点
- 人工复核结论

## 7. 冲突预防规则

- 功能分支按模块分片，禁止跨模块大包改动
- 每半天同步一次 develop
- 固定合并窗口，非窗口仅允许紧急修复
- 冲突超过阈值必须拆分 PR

## 8. 评审规则

- AI 生成代码必须标记关键人工复核点
- PR 必须包含回滚方案
- 不允许“仅 AI 自证通过”直接合并

## 9. 最低落地物

至少生成并维护：

- `TODO.md` (项目代办与进程管理)
- `BRANCH_REGISTRY.md`
- `CHANGELOG.md`
- `MERGE_WINDOW.md`
- `pull_request_template.md`
- `commit-msg` 校验钩子

## 10. v0.2 自动化门禁

协同方案升级时，必须给出自动化脚本落地方案：

- `memory_guard.py`：检查核心改动是否同步更新协同记忆
- `memory_guard.py`：命中冲突热点文件时输出阻断或预警
- `build_team_intent.py`：生成团队意图快照供 AI 复核使用

并输出最小执行命令：

- `python scripts/ai_collab/memory_guard.py --staged-only`
- `python scripts/ai_collab/build_team_intent.py`

## 11. Harness 复核要求

输出协同机制时必须包含三类 AI 角色：

- AI Builder
- AI Reviewer
- AI Test Engineer

并明确 Human Owner 的最终合并决策责任。