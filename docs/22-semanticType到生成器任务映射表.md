# 课堂 Vibe Coding 平台 semanticType 到生成器任务映射表

## 1. 文档目标

本文件用于定义 Schema Patch 中的 `semanticType` 如何映射为具体生成器任务，支撑：

- 编排服务任务拆分
- 代码生成器调度
- 联动校验触发
- 影响范围展示

## 2. 设计原则

- semanticType 决定任务种类
- 任务映射以最小必要集为主
- 一类 semanticType 可以触发多个生成器任务
- 生成器任务顺序必须可预测

## 3. 任务类型定义

首期建议任务类型如下：

- frontend_generate
- backend_generate
- linkage_check
- fix_generate
- schema_snapshot_update
- preview_refresh
- meta_update

## 4. 映射结构建议

```json
{
  "semanticType": "page_create",
  "tasks": [
    "frontend_generate",
    "schema_snapshot_update",
    "preview_refresh"
  ]
}
```

## 5. 核心映射表

| semanticType | 触发任务 | 优先级 | 说明 |
| --- | --- | --- | --- |
| project_update | meta_update, schema_snapshot_update | low | 更新项目元信息 |
| page_create | frontend_generate, schema_snapshot_update, preview_refresh | high | 新增页面 |
| page_delete | frontend_generate, schema_snapshot_update, preview_refresh | high | 删除页面 |
| route_create | frontend_generate, schema_snapshot_update, preview_refresh | high | 新增路由 |
| route_update | frontend_generate, schema_snapshot_update, preview_refresh | medium | 修改路由 |
| component_add | frontend_generate, schema_snapshot_update, preview_refresh | high | 新增组件 |
| component_update | frontend_generate, schema_snapshot_update, preview_refresh | medium | 修改组件属性 |
| entity_create | backend_generate, linkage_check, schema_snapshot_update | high | 新增实体 |
| entity_field_add | backend_generate, frontend_generate, linkage_check, schema_snapshot_update | high | 新增字段需前后端同步 |
| api_create | backend_generate, frontend_generate, linkage_check, schema_snapshot_update, preview_refresh | high | 新增接口 |
| api_update | backend_generate, frontend_generate, linkage_check, schema_snapshot_update, preview_refresh | high | 修改接口 |
| event_create | frontend_generate, linkage_check, schema_snapshot_update, preview_refresh | high | 新增交互 |
| event_update | frontend_generate, linkage_check, schema_snapshot_update, preview_refresh | medium | 修改交互 |
| showcase_publish | meta_update, schema_snapshot_update | low | 更新公告展示状态 |

## 6. 优先级约定

| 优先级 | 含义 |
| --- | --- |
| high | 立即执行，通常影响运行结果 |
| medium | 常规执行，影响交互或结构一致性 |
| low | 元数据或展示状态更新 |

## 7. 顺序执行建议

对于多任务 semanticType，建议按以下顺序：

1. schema_snapshot_update
2. frontend_generate / backend_generate
3. linkage_check
4. fix_generate
5. preview_refresh
6. meta_update

### 原因

- 先落快照，确保任务基于统一版本
- 再生成代码
- 再做一致性校验
- 校验失败时再触发修复
- 成功后刷新预览

## 8. 典型语义映射

## 8.1 page_create

### 输入

- `/ui/pages/-`
- `/ui/routes/-`

### 任务

- frontend_generate
- schema_snapshot_update
- preview_refresh

### 不一定触发

- backend_generate

## 8.2 entity_field_add

### 输入

- `/data/entities/*/fields/-`

### 任务

- backend_generate
- frontend_generate
- linkage_check
- schema_snapshot_update

### 原因

- 字段变化可能影响响应结构、页面展示和表单绑定

## 8.3 api_create

### 输入

- `/api/endpoints/-`

### 任务

- backend_generate
- frontend_generate
- linkage_check
- preview_refresh

## 8.4 showcase_publish

### 输入

- `/submission/showcase/*`

### 任务

- meta_update
- schema_snapshot_update

### 不触发

- frontend_generate
- backend_generate

## 9. 多 semanticType 合并策略

同一 Patch 内多个 semanticType 建议先合并后调度。

### 示例

Patch 同时包含：

- page_create
- route_create
- event_create

最终合并后任务：

- schema_snapshot_update
- frontend_generate
- linkage_check
- preview_refresh

而不是重复执行三次 frontend_generate。

## 10. linkage_check 触发规则

以下语义建议强制触发 `linkage_check`：

- entity_create
- entity_field_add
- api_create
- api_update
- event_create
- event_update 中涉及 query / mutation 绑定

## 11. fix_generate 触发规则

当 `linkage_check` 或运行结果出现错误时，建议按以下条件触发：

- diagnostics.level = error
- code 属于字段不一致、接口绑定缺失、响应结构缺失

不建议在以下情况自动触发：

- 纯权限错误
- 纯公告配置错误
- 资源池不足

## 12. preview_refresh 触发规则

以下语义建议触发：

- page_create
- page_delete
- route_create
- component_add
- component_update
- api_create
- api_update
- event_create

以下语义不建议触发：

- project_update
- showcase_publish

## 13. meta_update 触发规则

建议在以下场景触发：

- project_update
- showcase_publish
- 教师评分提交后的展示字段更新

## 14. 首期不建议支持的复杂映射

- semanticType 触发多技术栈并行生成
- semanticType 直接触发数据库迁移任务
- semanticType 直接触发外部部署

## 15. 建议下一步

基于本映射表，下一步最适合继续补充：

- 生成器任务状态机
- semanticType 到错误码映射表
- 任务合并与去重规则表
- 编排服务调度顺序清单
