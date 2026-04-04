# 课堂 Vibe Coding 平台 Patch 到文件变更映射表

## 1. 文档目标

本文件用于定义 Schema Patch 语义如何映射为代码生成器需要处理的目标文件集合，支撑：

- 增量代码生成
- 联动校验
- 调试修复
- 影响范围可视化

## 2. 设计原则

- Patch 决定“改哪些文件”，生成器决定“怎么改”
- 映射关系以语义类型为主，不直接依赖自然语言
- 一个 Patch 可以影响多个文件域
- 映射结果必须可追溯到 Schema 路径

## 3. 文件域定义

首期建议文件域如下：

- frontend_page
- frontend_component
- frontend_route
- frontend_store
- frontend_service
- backend_route
- backend_model
- backend_service
- schema_snapshot
- meta_log

## 4. 映射结构建议

```json
{
  "semanticType": "page_create",
  "schemaPaths": [
    "/ui/pages/-",
    "/ui/routes/-"
  ],
  "targetFiles": [
    {
      "domain": "frontend_page",
      "pathPattern": "frontend/src/pages/{pageName}.tsx",
      "action": "create"
    }
  ]
}
```

## 5. 核心语义映射

## 5.1 project_update

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/project/title`, `/project/description` |
| 主要影响文件 | `meta/project.json`, `schema/latest.json` |
| 默认动作 | update |

## 5.2 page_create

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/ui/pages/-` |
| 主要影响文件 | `frontend/src/pages/{Page}.tsx`, `schema/latest.json` |
| 默认动作 | create |

## 5.3 route_create

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/ui/routes/-` |
| 主要影响文件 | `frontend/src/routes/index.tsx`, `frontend/src/pages/{Page}.tsx` |
| 默认动作 | update |

## 5.4 component_add

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/ui/componentTree/-` |
| 主要影响文件 | `frontend/src/components/*`, `frontend/src/pages/*` |
| 默认动作 | create / update |

## 5.5 component_update

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/ui/componentTree/*/props/*` |
| 主要影响文件 | `frontend/src/components/*`, `frontend/src/pages/*` |
| 默认动作 | update |

## 5.6 entity_create

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/data/entities/-` |
| 主要影响文件 | `backend/app/models/*`, `backend/app/services/*` |
| 默认动作 | create |

## 5.7 entity_field_add

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/data/entities/*/fields/-` |
| 主要影响文件 | `backend/app/models/*`, `backend/app/routes/*`, `frontend/src/pages/*` |
| 默认动作 | update |

## 5.8 api_create

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/api/endpoints/-` |
| 主要影响文件 | `backend/app/routes/*`, `backend/app/services/*`, `frontend/src/services/*` |
| 默认动作 | create / update |

## 5.9 api_update

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/api/endpoints/*` |
| 主要影响文件 | `backend/app/routes/*`, `frontend/src/services/*` |
| 默认动作 | update |

## 5.10 event_create

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/logic/events/-` |
| 主要影响文件 | `frontend/src/pages/*`, `frontend/src/components/*`, `frontend/src/store/*` |
| 默认动作 | update |

## 5.11 event_update

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/logic/events/*` |
| 主要影响文件 | `frontend/src/pages/*`, `frontend/src/components/*` |
| 默认动作 | update |

## 5.12 showcase_publish

| 项 | 说明 |
| --- | --- |
| 典型 Schema 路径 | `/submission/showcase/*` |
| 主要影响文件 | `meta/showcase.json`, `schema/latest.json` |
| 默认动作 | update |

## 6. 前端文件映射建议

| 文件域 | 路径模式 | 说明 |
| --- | --- | --- |
| frontend_page | frontend/src/pages/{Page}.tsx | 页面代码 |
| frontend_component | frontend/src/components/{Component}.tsx | 组件代码 |
| frontend_route | frontend/src/routes/index.tsx | 路由配置 |
| frontend_store | frontend/src/store/{Store}.ts | 状态管理 |
| frontend_service | frontend/src/services/{Service}.ts | API 调用层 |

## 7. 后端文件映射建议

| 文件域 | 路径模式 | 说明 |
| --- | --- | --- |
| backend_route | backend/app/routes/{Module}.py | 接口路由 |
| backend_model | backend/app/models/{Entity}.py | 数据模型 |
| backend_service | backend/app/services/{Module}.py | 服务逻辑 |

## 8. 元数据文件映射建议

| 文件域 | 路径模式 | 说明 |
| --- | --- | --- |
| schema_snapshot | schema/latest.json | 最新 Schema 快照 |
| meta_log | meta/patch-log.json | Patch 记录 |

## 9. 多文件联动示例

## 9.1 新增详情页

### 输入语义

- page_create
- route_create
- event_create

### 目标文件

- `frontend/src/pages/Detail.tsx`
- `frontend/src/routes/index.tsx`
- `frontend/src/pages/Home.tsx`
- `schema/latest.json`

## 9.2 新增留言接口

### 输入语义

- api_create
- entity_field_add
- event_create

### 目标文件

- `backend/app/routes/messages.py`
- `backend/app/models/message.py`
- `frontend/src/services/messages.ts`
- `frontend/src/pages/Detail.tsx`
- `schema/latest.json`

## 10. 影响范围分级

建议把 Patch 到文件的影响范围分成三档：

| 等级 | 含义 |
| --- | --- |
| low | 单文件局部更新 |
| medium | 同端多文件更新 |
| high | 前后端联动更新 |

### 判断建议

- 只改主题色：low
- 新增页面与路由：medium
- 新增实体 + 接口 + 页面绑定：high

## 11. 生成器调度建议

Patch 进入生成器前，先做文件域拆分：

1. 识别 semanticType
2. 推导目标文件域
3. 合并相同文件域任务
4. 分发给对应生成器

## 12. 联动校验建议

以下情况建议自动触发联动校验：

- entity_field_add
- api_create
- api_update
- event_create
- component_update 中涉及 dataSource / titleField / subtitleField

## 13. 首期不建议支持的映射

- 一个 Patch 直接生成跨技术栈多套实现
- Patch 直接修改运行环境脚本
- Patch 直接生成外部服务接入配置

## 14. 建议下一步

基于本映射表，下一步最适合继续补充：

- semanticType 到生成器任务映射表
- 文件域到模板目录映射表
- Patch 联动校验规则表
- 典型变更回归用例清单
