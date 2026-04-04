# 课堂 Vibe Coding 平台 Project Schema 草案

## 1. 文档目标

本草案用于定义课堂 Vibe Coding 平台的统一中间模型。其核心作用是：

- 作为对话驱动与手动配置驱动的共同事实源
- 作为前后端联动生成、校验、运行和留痕的基础结构
- 作为快照、回放、评分、画像与优秀作品展示的结构化数据来源

首期设计原则：

- 结构稳定优先于自由度
- 可生成优先于可表达一切
- 前后端联动优先于单端灵活性
- 课堂管理与过程评价优先于工程级通用性

## 2. Schema 分层

建议将 Project Schema 分成九层：

1. 教学上下文层
2. 项目元信息层
3. 页面与组件层
4. 交互与状态层
5. 数据模型层
6. API 与服务层
7. 运行配置层
8. 过程留痕层
9. 提交与展示层

## 3. 顶层结构

```json
{
  "schemaVersion": "0.1.0",
  "context": {},
  "project": {},
  "ui": {},
  "logic": {},
  "data": {},
  "api": {},
  "runtime": {},
  "process": {},
  "submission": {}
}
```

## 4. 教学上下文层

用于表达当前项目属于哪门课、哪个主题、哪个问题，以及教师给定的边界。

```json
{
  "context": {
    "courseId": "course_web_01",
    "courseName": "Web 创意原型设计",
    "classId": "class_2026_spring_1",
    "sessionId": "session_2026_03_30_a",
    "topicId": "topic_campus_service",
    "topicName": "校园服务创意",
    "questionId": "question_book_trade",
    "questionTitle": "校园二手书交换平台",
    "teacherConstraints": {
      "allowFreeExploration": true,
      "allowDependencyInstall": false,
      "publicShowEnabled": true
    },
    "rubricProfileId": "rubric_web_prototype_basic"
  }
}
```

### 关键字段

- `courseId`：课程标识
- `classId`：班级标识
- `sessionId`：本次课堂会话标识
- `topicId` / `questionId`：主题与问题定位
- `teacherConstraints`：教师为当前问题施加的边界
- `rubricProfileId`：绑定的评分模板

## 5. 项目元信息层

用于表达学生项目本身的基本属性。

```json
{
  "project": {
    "projectId": "project_stu_001",
    "ownerUserId": "student_001",
    "title": "校园二手书交换站",
    "description": "支持图书发布、搜索和留言",
    "status": "draft",
    "templateId": null,
    "techStackProfile": "webapp_react_fastapi_standard",
    "language": "zh-CN",
    "visibility": "private",
    "createdAt": "2026-03-30T10:00:00Z",
    "updatedAt": "2026-03-30T10:25:00Z"
  }
}
```

### 枚举建议

- `status`：`draft` / `running` / `error` / `submitted` / `published`
- `visibility`：`private` / `class_visible` / `public_showcase`

## 6. 页面与组件层

用于描述前端结构，是对话与手动配置最常操作的一层。

```json
{
  "ui": {
    "routes": [
      {
        "id": "route_home",
        "path": "/",
        "pageId": "page_home"
      },
      {
        "id": "route_detail",
        "path": "/books/:id",
        "pageId": "page_detail"
      }
    ],
    "pages": [
      {
        "id": "page_home",
        "name": "首页",
        "layout": "default",
        "components": [
          "hero_banner",
          "search_form",
          "book_list"
        ]
      }
    ],
    "componentTree": [
      {
        "id": "book_list",
        "type": "List",
        "props": {
          "dataSource": "query_books",
          "cardStyle": "shadow"
        },
        "children": [
          {
            "id": "book_card",
            "type": "Card",
            "props": {
              "titleField": "title",
              "subtitleField": "ownerName"
            }
          }
        ]
      }
    ],
    "theme": {
      "preset": "campus_light",
      "primaryColor": "#1677ff",
      "borderRadius": "medium"
    }
  }
}
```

### 设计要求

- 页面、路由、组件三者必须可追溯
- 所有组件必须有稳定 id
- `props` 中只能出现受控字段，避免不可生成内容扩散
- 主题、布局、组件库能力应统一在受控枚举内

## 7. 交互与状态层

用于描述按钮点击、表单提交、页面跳转、状态联动等行为。

```json
{
  "logic": {
    "events": [
      {
        "id": "event_search_submit",
        "trigger": {
          "componentId": "search_form",
          "eventName": "onSubmit"
        },
        "actions": [
          {
            "type": "setQueryParams",
            "target": "query_books",
            "mapping": {
              "keyword": "form.keyword"
            }
          },
          {
            "type": "refetchQuery",
            "target": "query_books"
          }
        ]
      },
      {
        "id": "event_card_click",
        "trigger": {
          "componentId": "book_card",
          "eventName": "onClick"
        },
        "actions": [
          {
            "type": "navigate",
            "target": "/books/:id",
            "mapping": {
              "id": "item.id"
            }
          }
        ]
      }
    ],
    "stateStores": [
      {
        "id": "store_filters",
        "fields": [
          {
            "name": "keyword",
            "type": "string",
            "defaultValue": ""
          }
        ]
      }
    ]
  }
}
```

### 设计要求

- 行为必须拆成 `trigger + actions`
- action 类型应采用有限集合，便于生成和校验
- 与 API 的关系通过 query 或 mutation id 连接，不直接耦合到源码函数名

## 8. 数据模型层

用于描述实体、字段、校验规则和数据来源。

```json
{
  "data": {
    "entities": [
      {
        "id": "entity_book",
        "name": "Book",
        "fields": [
          {
            "name": "id",
            "type": "string",
            "required": true
          },
          {
            "name": "title",
            "type": "string",
            "required": true
          },
          {
            "name": "price",
            "type": "number",
            "required": true
          },
          {
            "name": "ownerName",
            "type": "string",
            "required": true
          }
        ]
      }
    ],
    "validationRules": [
      {
        "entityId": "entity_book",
        "field": "price",
        "rule": "min",
        "value": 0
      }
    ],
    "dataSourceMode": "sqlite"
  }
}
```

### 首期建议

- 首期字段类型控制在 `string / number / boolean / array / object / datetime`
- 首期数据源模式控制在 `mock / memory / sqlite`
- 不进入复杂数据库迁移与多表高级关系设计

## 9. API 与服务层

用于定义前后端接口结构，是前后端联动生成的桥梁。

```json
{
  "api": {
    "endpoints": [
      {
        "id": "api_list_books",
        "method": "GET",
        "path": "/api/books",
        "queryParams": [
          {
            "name": "keyword",
            "type": "string",
            "required": false
          }
        ],
        "responseRef": "entity_book[]",
        "handlerMode": "generated"
      },
      {
        "id": "api_create_message",
        "method": "POST",
        "path": "/api/messages",
        "requestBody": {
          "fields": [
            {
              "name": "bookId",
              "type": "string",
              "required": true
            },
            {
              "name": "content",
              "type": "string",
              "required": true
            }
          ]
        },
        "responseBody": {
          "fields": [
            {
              "name": "success",
              "type": "boolean",
              "required": true
            }
          ]
        },
        "handlerMode": "generated"
      }
    ],
    "queries": [
      {
        "id": "query_books",
        "endpointId": "api_list_books",
        "bindTo": "book_list"
      }
    ],
    "mutations": [
      {
        "id": "mutation_message_submit",
        "endpointId": "api_create_message",
        "successAction": "toast_success"
      }
    ]
  }
}
```

### 校验重点

- `responseRef` 与数据模型层必须一致
- `queries / mutations` 必须能追溯到 ui 或 logic 层
- path、method、requestBody、responseBody 必须可自动生成接口代码与前端调用代码

## 10. 运行配置层

用于表达运行环境和资源边界。

```json
{
  "runtime": {
    "profile": "docker_standard_webapp",
    "frontend": {
      "framework": "react_vite",
      "port": 3000
    },
    "backend": {
      "framework": "fastapi",
      "port": 8000
    },
    "dependencyPolicy": {
      "installAllowed": false,
      "presetBundles": [
        "langchain",
        "antd",
        "axios",
        "zustand"
      ]
    },
    "resourceQuota": {
      "cpu": "1",
      "memory": "1Gi",
      "ttlMinutes": 90
    },
    "networkPolicy": {
      "externalAccess": "restricted"
    }
  }
}
```

### 设计要求

- 运行配置来源于平台标准能力，而不是学生自由输入
- 资源配额应支持教师课堂动态覆盖
- 访问公开结果页时，应单独定义短期展示策略而不是复用工作区运行地址

## 11. 过程留痕层

用于支撑回放、评分、认知分析与调试。

```json
{
  "process": {
    "currentStage": "debugging",
    "snapshots": [
      {
        "id": "snap_001",
        "type": "schema",
        "createdAt": "2026-03-30T10:12:00Z",
        "summary": "新增图书详情页和留言接口"
      }
    ],
    "timelineRefs": [
      "event_prompt_001",
      "event_schema_patch_003",
      "event_run_002"
    ],
    "agentRuns": [
      {
        "id": "agent_run_backend_001",
        "agentType": "backend_generator",
        "status": "success",
        "durationMs": 4200
      }
    ],
    "evaluationHints": {
      "aiDependencyLevel": "medium",
      "iterationCount": 6,
      "debugRecoveryCount": 2
    }
  }
}
```

### 关键用途

- 支撑教师过程观察与认知分析
- 作为系统自动评分的输入
- 作为优秀作品展示中的“流程摘要”来源

## 12. 提交与展示层

用于表达学生提交结果、成绩、公告展示状态。

```json
{
  "submission": {
    "submitStatus": "submitted",
    "submittedAt": "2026-03-30T10:45:00Z",
    "teacherScore": {
      "processScore": 84,
      "resultScore": 88
    },
    "autoScore": {
      "processScore": 79,
      "resultScore": 86,
      "generatedAt": "2026-03-30T11:00:00Z"
    },
    "showcase": {
      "published": true,
      "publicFields": [
        "pipeline_view",
        "result_page"
      ],
      "accessPolicy": {
        "type": "expiring_url",
        "expiresAt": "2026-04-06T00:00:00Z"
      }
    }
  }
}
```

## 13. Schema Patch 机制

为支持对话和手动配置统一落盘，建议定义 Schema Patch。

```json
{
  "patchId": "patch_001",
  "source": "chat",
  "operations": [
    {
      "op": "add",
      "path": "/ui/routes/-",
      "value": {
        "id": "route_detail",
        "path": "/books/:id",
        "pageId": "page_detail"
      }
    },
    {
      "op": "replace",
      "path": "/project/title",
      "value": "校园二手书交换站"
    }
  ],
  "reason": "学生要求增加详情页并优化项目命名"
}
```

### Patch 来源建议

- `chat`
- `manual_config`
- `agent_plan`
- `auto_fix`
- `teacher_publish`

## 14. 一致性校验规则

首期至少做以下校验：

### 14.1 结构校验

- 必填字段是否存在
- id 是否唯一
- 枚举值是否合法

### 14.2 联动校验

- 页面绑定的数据源是否存在
- 组件事件引用的 action 是否存在
- query / mutation 对应的 endpoint 是否存在
- endpoint 的 response 是否与实体定义兼容

### 14.3 运行校验

- 端口是否冲突
- 技术栈 profile 是否受支持
- 依赖策略是否违反平台限制

### 14.4 展示校验

- 公告区公开字段是否在允许集合内
- 公开地址是否配置为限时访问

## 15. 首期不纳入 Schema 的内容

为控制复杂度，以下内容建议暂不纳入首期 Schema：

- 任意 npm / pip 依赖安装
- 多人协作编辑状态
- 复杂数据库关系迁移
- 自定义 Agent 图编排
- 外部第三方 API 凭据管理

## 16. 推荐落地方式

建议按三步推进：

1. 先定义 JSON Schema 或 TypeScript 类型
2. 再实现 Schema Patch、校验器和快照存储
3. 最后让前端配置面板、对话解析器、代码生成器全部接入同一模型

## 17. 建议下一步

基于本草案，下一份最适合继续产出的文档是：

- Schema 字段字典
- Schema Patch 操作规范
- 前端配置面板与 Schema 字段映射表
- 代码生成器输入输出契约
