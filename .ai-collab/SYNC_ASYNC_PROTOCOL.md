# Sync / Async Protocol

## 1. Async Protocol

适用于开发过程中低摩擦同步。

### 触发条件

- 改动公共接口
- 改动 Schema 字段
- 改动高风险文件

### 必须动作

1. 更新 `CHANGELOG.md`
2. 更新 `FILE_MEMORY.md` 或 `AGENT_MEMORY.md`
3. 在分支登记表中更新状态

## 2. Sync Protocol

适用于合并窗口内强一致同步。

### 触发条件

- 进入固定合并窗口
- 发布前冻结阶段
- 冲突升级处理

### 必须动作

1. rebase develop
2. 运行 lint / typecheck / test
3. 执行 PR 模板核对
4. 审核记忆文件是否完整
5. 冲突处理后写入同步结论

## 3. 冲突升级阈值

出现任一条件时升级到同步处理：

- 冲突处理超过 30 分钟
- 冲突涉及核心接口或 Schema
- 同一文件两天内重复冲突两次以上
