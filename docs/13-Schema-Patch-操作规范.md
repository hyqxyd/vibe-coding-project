# 课堂 Vibe Coding 平台 Schema Patch 操作规范

## 1. 文档目标

本规范用于定义 Project Schema 的变更描述方式，确保：

- 对话生成与配置面板操作使用同一套变更表达
- Patch 可被校验、回放、合并、审计
- 代码生成器可以基于 Patch 做增量生成

## 2. 设计原则

- Patch 描述“结构变化”，不描述源码细节
- Patch 可追溯来源、意图、影响范围
- Patch 必须可校验、可重放、可回滚
- Patch 应支持最小化变更，避免整棵 Schema 全量覆盖

## 3. 顶层结构

```json
{
  "patchId": "patch_001",
  "schemaVersion": "0.1.0",
  "projectId": "project_stu_001",
  "baseSnapshotId": "snap_003",
  "source": "chat",
  "operator": {
    "actorType": "student",
    "actorId": "student_001"
  },
  "reason": "学生要求新增详情页并配置跳转",
  "operations": [],
  "metadata": {
    "createdAt": "2026-03-30T10:20:00Z",
    "requestId": "req_20260330_011"
  }
}
```

## 4. 顶层字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| patchId | string | 是 | Patch 唯一标识 |
| schemaVersion | string | 是 | 目标 Schema 版本 |
| projectId | string | 是 | 目标项目 |
| baseSnapshotId | string | 是 | 变更基于的快照 id |
| source | enum | 是 | 变更来源 |
| operator | object | 是 | 变更发起者 |
| reason | string | 否 | 变更原因摘要 |
| operations | array | 是 | 具体操作集合 |
| metadata | object | 是 | 时间与请求上下文 |

## 5. source 枚举

首期建议支持：

- chat
- manual_config
- agent_plan
- auto_fix
- teacher_publish
- system_repair

## 6. operator 字段

```json
{
  "operator": {
    "actorType": "student",
    "actorId": "student_001"
  }
}
```

### actorType 枚举

- student
- teacher
- agent
- system

## 7. operation 结构

```json
{
  "op": "add",
  "path": "/ui/pages/-",
  "value": {
    "id": "page_detail",
    "name": "详情页",
    "layout": "default",
    "components": []
  },
  "semanticType": "page_create",
  "impact": [
    "ui",
    "route"
  ]
}
```

## 8. op 类型定义

首期建议仅支持三类核心操作：

- add
- replace
- remove

### 8.1 add

用于新增对象、数组项或字段。

适用场景：

- 新增页面
- 新增接口
- 新增字段
- 新增事件

### 8.2 replace

用于替换单个字段值或对象。

适用场景：

- 修改项目标题
- 修改主题色
- 修改接口方法
- 修改资源配额

### 8.3 remove

用于删除数组项或字段。

适用场景：

- 删除页面
- 删除路由
- 删除事件绑定

## 9. path 规范

path 建议采用 JSON Pointer 风格。

示例：

- `/project/title`
- `/ui/pages/0/name`
- `/ui/routes/-`
- `/logic/events/2/actions/0`

### 规范要求

- path 必须指向确定的 Schema 节点
- 数组追加统一使用 `-`
- 不允许使用模糊路径

## 10. value 规范

- `add` 必须提供 value
- `replace` 必须提供 value
- `remove` 可以不提供 value
- value 必须符合目标字段字典约束

## 11. semanticType 规范

为了便于留痕、可视化与代码生成，建议每条 operation 补充语义类型。

### 首期语义类型建议

- project_update
- page_create
- page_delete
- route_create
- route_update
- component_add
- component_update
- entity_create
- entity_field_add
- api_create
- api_update
- event_create
- event_update
- showcase_publish

## 12. impact 字段

用于标记该操作可能影响哪些层。

首期建议可选值：

- context
- project
- ui
- logic
- data
- api
- runtime
- process
- submission
- route
- preview

## 13. Patch 校验规则

## 13.1 顶层校验

- patchId 非空
- projectId 非空
- source 合法
- baseSnapshotId 存在
- operations 至少 1 条

## 13.2 操作校验

- op 合法
- path 合法
- value 类型符合字段字典
- semanticType 在允许集合内

## 13.3 联动校验

- 新增 page 后是否存在 route 或可被引用
- 删除 entity 字段后是否影响 endpoint response
- 删除 endpoint 后是否影响 query / mutation

## 14. Patch 合并策略

## 14.1 同批次合并

同一次用户操作可由多个 operation 组成一个 patch。

示例：

- 新增详情页
- 新增详情路由
- 新增卡片点击跳转事件

应合并为一个 patch，而不是拆成多个独立 patch。

## 14.2 冲突处理

当多个 Patch 修改同一路径时，建议按以下顺序处理：

1. 先检查是否基于同一 `baseSnapshotId`
2. 若不是同一快照，尝试重放并校验
3. 冲突时以最新时间戳为默认策略
4. 若冲突影响核心结构，进入人工确认或系统回退

## 15. 回滚策略

建议通过快照级回滚，而不是逐条 Patch 反向推导回滚。

原因：

- 实现简单
- 结果稳定
- 更适合课堂场景

### 建议方案

- 每次成功 Patch 后生成新快照
- 回滚时恢复到指定 snapshotId
- Patch 保留为历史记录，不删除

## 16. Patch 来源差异

## 16.1 chat

特点：

- 语义来源于自然语言
- 通常伴随 `reason`
- 常包含多个相关操作

## 16.2 manual_config

特点：

- 来源稳定、字段明确
- 更适合细粒度 replace
- 与配置面板字段一一对应

## 16.3 auto_fix

特点：

- 由调试 Agent 或系统生成
- 需要额外记录失败证据来源
- 应标记是否自动应用

## 17. 典型 Patch 示例

## 17.1 修改项目标题

```json
{
  "patchId": "patch_101",
  "source": "manual_config",
  "operations": [
    {
      "op": "replace",
      "path": "/project/title",
      "value": "校园二手书交换站",
      "semanticType": "project_update",
      "impact": [
        "project"
      ]
    }
  ]
}
```

## 17.2 新增详情页

```json
{
  "patchId": "patch_102",
  "source": "chat",
  "operations": [
    {
      "op": "add",
      "path": "/ui/pages/-",
      "value": {
        "id": "page_detail",
        "name": "详情页",
        "layout": "default",
        "components": []
      },
      "semanticType": "page_create",
      "impact": [
        "ui"
      ]
    },
    {
      "op": "add",
      "path": "/ui/routes/-",
      "value": {
        "id": "route_detail",
        "path": "/books/:id",
        "pageId": "page_detail"
      },
      "semanticType": "route_create",
      "impact": [
        "ui",
        "route"
      ]
    }
  ]
}
```

## 17.3 发布优秀作品

```json
{
  "patchId": "patch_103",
  "source": "teacher_publish",
  "operations": [
    {
      "op": "replace",
      "path": "/submission/showcase/published",
      "value": true,
      "semanticType": "showcase_publish",
      "impact": [
        "submission",
        "preview"
      ]
    },
    {
      "op": "replace",
      "path": "/submission/showcase/publicFields",
      "value": [
        "pipeline_view",
        "result_page"
      ],
      "semanticType": "showcase_publish",
      "impact": [
        "submission"
      ]
    }
  ]
}
```

## 18. 日志与审计建议

每个 Patch 建议记录：

- patchId
- source
- actorId
- baseSnapshotId
- affectedPaths
- semanticTypes
- 校验结果
- 是否成功应用

## 19. 首期不建议支持的高级能力

- Patch 条件表达式
- 跨项目 Patch
- 事务性多项目联动 Patch
- 自定义脚本型 Patch

## 20. 建议下一步

基于本规范，下一步最适合继续补充：

- Patch 错误码设计
- Patch 合并冲突规则表
- Patch 到代码生成任务映射表
- Patch 操作测试用例清单
