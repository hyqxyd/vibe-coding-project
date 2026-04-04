# 课堂 Vibe Coding 平台 Schema 字段字典

## 1. 文档目标

本字典用于补充 Project Schema 草案，明确首期每个核心字段的含义、类型、是否必填、约束和使用说明，便于：

- 前端配置面板开发
- 对话解析结果落盘
- 代码生成器消费
- 校验器实现
- 后续版本演进

## 2. 顶层字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| schemaVersion | string | 是 | Schema 版本号 |
| context | object | 是 | 教学上下文层 |
| project | object | 是 | 项目元信息层 |
| ui | object | 是 | 页面与组件层 |
| logic | object | 是 | 交互与状态层 |
| data | object | 是 | 数据模型层 |
| api | object | 是 | API 与服务层 |
| runtime | object | 是 | 运行配置层 |
| process | object | 是 | 过程留痕层 |
| submission | object | 是 | 提交与展示层 |

## 3. context 字段

| 字段路径 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- |
| context.courseId | string | 是 | 非空 | 课程唯一标识 |
| context.courseName | string | 是 | 非空 | 课程名称 |
| context.classId | string | 是 | 非空 | 班级唯一标识 |
| context.sessionId | string | 是 | 非空 | 一次课堂会话标识 |
| context.topicId | string | 是 | 非空 | 主题唯一标识 |
| context.topicName | string | 是 | 非空 | 主题名称 |
| context.questionId | string | 是 | 非空 | 问题唯一标识 |
| context.questionTitle | string | 是 | 非空 | 问题标题 |
| context.teacherConstraints | object | 是 | 受控对象 | 教师约束集合 |
| context.rubricProfileId | string | 否 | 可空 | 绑定的课程评分模板 |

### teacherConstraints 子字段

| 字段路径 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| context.teacherConstraints.allowFreeExploration | boolean | 是 | true | 是否允许超题目自由发挥 |
| context.teacherConstraints.allowDependencyInstall | boolean | 是 | false | 是否允许安装额外依赖 |
| context.teacherConstraints.publicShowEnabled | boolean | 是 | false | 是否允许优秀作品展示 |

## 4. project 字段

| 字段路径 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- |
| project.projectId | string | 是 | 全局唯一 | 项目标识 |
| project.ownerUserId | string | 是 | 非空 | 学生用户标识 |
| project.title | string | 是 | 1-100 字 | 项目标题 |
| project.description | string | 否 | 最长 500 字 | 项目描述 |
| project.status | enum | 是 | draft/running/error/submitted/published | 项目状态 |
| project.templateId | string|null | 否 | 可空 | 模板来源 |
| project.techStackProfile | string | 是 | 受控 profile | 技术栈配置名 |
| project.language | string | 是 | 例如 zh-CN | 项目默认语言 |
| project.visibility | enum | 是 | private/class_visible/public_showcase | 可见性 |
| project.createdAt | string | 是 | ISO8601 | 创建时间 |
| project.updatedAt | string | 是 | ISO8601 | 更新时间 |

## 5. ui 字段

## 5.1 routes

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ui.routes[] | array<object> | 否 | 路由列表 |
| ui.routes[].id | string | 是 | 路由唯一标识 |
| ui.routes[].path | string | 是 | 路由路径 |
| ui.routes[].pageId | string | 是 | 绑定页面 id |

### 约束

- `path` 在项目内唯一
- `pageId` 必须能在 `ui.pages[].id` 中找到

## 5.2 pages

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ui.pages[] | array<object> | 是 | 页面列表 |
| ui.pages[].id | string | 是 | 页面唯一标识 |
| ui.pages[].name | string | 是 | 页面名称 |
| ui.pages[].layout | string | 是 | 布局枚举 |
| ui.pages[].components[] | array<string> | 否 | 页面引用的组件 id 列表 |

## 5.3 componentTree

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ui.componentTree[] | array<object> | 否 | 组件树根节点列表 |
| ui.componentTree[].id | string | 是 | 组件唯一标识 |
| ui.componentTree[].type | string | 是 | 组件类型 |
| ui.componentTree[].props | object | 否 | 受控属性集合 |
| ui.componentTree[].children[] | array<object> | 否 | 子组件集合 |

### 首期组件类型建议

- Page
- Section
- Form
- Input
- Button
- Card
- List
- Table
- Modal
- Tabs
- Chart

## 5.4 theme

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| ui.theme.preset | string | 是 | 主题预设名 |
| ui.theme.primaryColor | string | 否 | 主色 |
| ui.theme.borderRadius | enum | 否 | small/medium/large |

## 6. logic 字段

## 6.1 events

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| logic.events[] | array<object> | 否 | 交互事件列表 |
| logic.events[].id | string | 是 | 事件标识 |
| logic.events[].trigger | object | 是 | 触发源定义 |
| logic.events[].actions[] | array<object> | 是 | 执行动作列表 |

### trigger 子字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| logic.events[].trigger.componentId | string | 是 | 来源组件 id |
| logic.events[].trigger.eventName | string | 是 | 触发事件名 |

### actions 子字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| logic.events[].actions[].type | string | 是 | 动作类型 |
| logic.events[].actions[].target | string | 否 | 动作目标 |
| logic.events[].actions[].mapping | object | 否 | 参数映射 |

### 首期动作类型建议

- navigate
- setState
- setQueryParams
- refetchQuery
- callMutation
- showToast
- openModal
- closeModal

## 6.2 stateStores

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| logic.stateStores[] | array<object> | 否 | 状态仓列表 |
| logic.stateStores[].id | string | 是 | 状态仓标识 |
| logic.stateStores[].fields[] | array<object> | 是 | 状态字段列表 |

## 7. data 字段

## 7.1 entities

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| data.entities[] | array<object> | 是 | 实体定义 |
| data.entities[].id | string | 是 | 实体标识 |
| data.entities[].name | string | 是 | 实体名称 |
| data.entities[].fields[] | array<object> | 是 | 字段定义 |

### field 子字段

| 字段路径 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- |
| data.entities[].fields[].name | string | 是 | 非空 | 字段名 |
| data.entities[].fields[].type | enum | 是 | string/number/boolean/array/object/datetime | 字段类型 |
| data.entities[].fields[].required | boolean | 是 | - | 是否必填 |

## 7.2 validationRules

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| data.validationRules[] | array<object> | 否 | 校验规则列表 |
| data.validationRules[].entityId | string | 是 | 目标实体 |
| data.validationRules[].field | string | 是 | 目标字段 |
| data.validationRules[].rule | string | 是 | 规则类型 |
| data.validationRules[].value | any | 否 | 规则参数 |

### 首期规则类型建议

- required
- min
- max
- minLength
- maxLength
- pattern

## 7.3 dataSourceMode

| 字段路径 | 类型 | 必填 | 约束 | 说明 |
| --- | --- | --- | --- | --- |
| data.dataSourceMode | enum | 是 | mock/memory/sqlite | 数据源模式 |

## 8. api 字段

## 8.1 endpoints

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| api.endpoints[] | array<object> | 是 | 接口定义列表 |
| api.endpoints[].id | string | 是 | 接口标识 |
| api.endpoints[].method | enum | 是 | GET/POST/PUT/PATCH/DELETE |
| api.endpoints[].path | string | 是 | 路径 |
| api.endpoints[].queryParams[] | array<object> | 否 | 查询参数 |
| api.endpoints[].requestBody | object | 否 | 请求体定义 |
| api.endpoints[].responseBody | object | 否 | 响应体定义 |
| api.endpoints[].responseRef | string | 否 | 引用实体表达式 |
| api.endpoints[].handlerMode | enum | 是 | generated/manual_stub |

## 8.2 queries

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| api.queries[] | array<object> | 否 | 前端查询绑定 |
| api.queries[].id | string | 是 | 查询标识 |
| api.queries[].endpointId | string | 是 | 目标接口 id |
| api.queries[].bindTo | string | 否 | 绑定组件 id |

## 8.3 mutations

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| api.mutations[] | array<object> | 否 | 前端变更绑定 |
| api.mutations[].id | string | 是 | 变更标识 |
| api.mutations[].endpointId | string | 是 | 目标接口 id |
| api.mutations[].successAction | string | 否 | 成功后的默认动作 |

## 9. runtime 字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| runtime.profile | string | 是 | 运行 profile |
| runtime.frontend.framework | string | 是 | 前端框架 |
| runtime.frontend.port | number | 是 | 前端端口 |
| runtime.backend.framework | string | 是 | 后端框架 |
| runtime.backend.port | number | 是 | 后端端口 |
| runtime.dependencyPolicy.installAllowed | boolean | 是 | 是否允许装依赖 |
| runtime.dependencyPolicy.presetBundles[] | array<string> | 否 | 预装依赖包 |
| runtime.resourceQuota.cpu | string | 是 | CPU 配额 |
| runtime.resourceQuota.memory | string | 是 | 内存配额 |
| runtime.resourceQuota.ttlMinutes | number | 是 | 会话过期时间 |
| runtime.networkPolicy.externalAccess | enum | 是 | restricted/disabled/controlled |

## 10. process 字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| process.currentStage | enum | 否 | 当前阶段 |
| process.snapshots[] | array<object> | 否 | 快照列表 |
| process.timelineRefs[] | array<string> | 否 | 事件引用列表 |
| process.agentRuns[] | array<object> | 否 | Agent 执行记录 |
| process.evaluationHints | object | 否 | 评分辅助指标 |

### currentStage 枚举建议

- understanding
- planning
- building
- debugging
- reviewing
- submitted

### evaluationHints 子字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| process.evaluationHints.aiDependencyLevel | enum | 否 | high/medium/low |
| process.evaluationHints.iterationCount | number | 否 | 迭代次数 |
| process.evaluationHints.debugRecoveryCount | number | 否 | 修复成功次数 |

## 11. submission 字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| submission.submitStatus | enum | 否 | draft/submitted/reviewed/published |
| submission.submittedAt | string | 否 | 提交时间 |
| submission.teacherScore | object | 否 | 教师分数 |
| submission.autoScore | object | 否 | 系统建议分 |
| submission.showcase | object | 否 | 公告展示配置 |

### teacherScore / autoScore 子字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| submission.teacherScore.processScore | number | 否 | 过程分 |
| submission.teacherScore.resultScore | number | 否 | 结果分 |
| submission.autoScore.processScore | number | 否 | 系统过程分建议 |
| submission.autoScore.resultScore | number | 否 | 系统结果分建议 |
| submission.autoScore.generatedAt | string | 否 | 生成时间 |

### showcase 子字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| submission.showcase.published | boolean | 是 | 是否已发布 |
| submission.showcase.publicFields[] | array<string> | 否 | 公开字段集合 |
| submission.showcase.accessPolicy.type | string | 是 | 访问策略类型 |
| submission.showcase.accessPolicy.expiresAt | string | 否 | 失效时间 |

### publicFields 首期允许值

- pipeline_view
- result_page

## 12. Patch 元字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| patchId | string | 是 | Patch 标识 |
| source | enum | 是 | chat/manual_config/agent_plan/auto_fix/teacher_publish |
| operations[] | array<object> | 是 | 操作集合 |
| reason | string | 否 | 变更原因 |

### operations 子字段

| 字段路径 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| operations[].op | enum | 是 | add/replace/remove |
| operations[].path | string | 是 | JSON Pointer 路径 |
| operations[].value | any | 否 | 写入值 |

## 13. 首期强校验字段

以下字段建议在首期作为强校验：

- schemaVersion
- context.courseId
- context.classId
- context.topicId
- context.questionId
- project.projectId
- project.title
- project.techStackProfile
- project.status
- data.dataSourceMode
- runtime.profile
- runtime.resourceQuota

## 14. 默认值建议

| 字段路径 | 默认值 |
| --- | --- |
| schemaVersion | 0.1.0 |
| project.status | draft |
| project.visibility | private |
| context.teacherConstraints.allowFreeExploration | true |
| context.teacherConstraints.allowDependencyInstall | false |
| runtime.dependencyPolicy.installAllowed | false |
| submission.showcase.published | false |

## 15. 命名规范建议

- id 字段统一使用 snake_case 或稳定前缀命名
- path 字段统一使用 URL 风格
- 枚举值统一小写蛇形或小写短横线风格，不混用
- 对外显示名称与内部标识分离，例如 `name` 与 `id` 同时保留

## 16. 后续扩展保留字段

为避免未来改动成本过高，建议保留但首期可不启用以下字段：

- project.tags
- context.groupId
- ui.permissions
- api.authPolicy
- runtime.nodeAffinity
- process.riskFlags
- submission.teacherComment

## 17. 建议下一步

基于本字段字典，下一步最适合继续补充：

- Schema Patch 操作规范
- 前端配置面板与字段映射表
- 代码生成器输入输出契约
- Schema 校验错误码设计
