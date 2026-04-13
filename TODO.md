# Vibe Coding Project - 任务与进程管理 (TODO)

> **📝 核心规范**：本文件是项目的“唯一事实来源 (Single Source of Truth)”。AI 助手在每次完成任务、接收新需求或调整架构后，都必须主动更新此文件，确保项目进度透明、不混乱。

## 🏃 当前冲刺 (Current Sprint)

- [ ] **验证场景 B：多智能体协作 (Multi-Agent Pipeline)**
  - **描述**：在画布中串联多个 Agent 节点，测试上下文和中间产物的流转。
- [x] **生产级安全架构落地 (MVP)**
  - **完成时间**：2026-04-09
  - **描述**：在 Java 控制面实现 API Proxy Gateway 代理接口，彻底切断前端和沙箱直接访问外网大模型的权限。
- [x] **前端工作区持久化与防崩溃 (Scenario A 演示准备)**
  - **完成时间**：2026-04-09
  - **描述**：修复了 React Flow 的 `position` 崩溃 bug；实现了基于 LocalStorage 的本地状态缓存与恢复机制；增加了后端沙箱就绪检查的握手拦截。

## ⏳ 待办池 (Backlog - 明日计划 2026-04-14)

- [ ] **验证场景 B 的多 Agent 数据流转**
  - **描述**：测试真实的业务链路：Input -> Agent 1 (分析) -> Agent 2 (处理) -> Output，确保上一个节点的 JSON 输出能正确注入到下一个节点的 Prompt 中。
- [ ] **Scenario A 演示前联调清单**
  - **描述**：演示前依次确认前端 `5173`、控制面 `8080`、数据面 `50051` 均可用；验证一次“Deploy -> Generate -> Docker 输出回填”全链路。
- [ ] **完善工作区双向同步与持久化 (后端)**
  - **描述**：目前只是前端 LocalStorage 缓存。明天需要将工作台的 `workflow.json` 和代码文件统一持久化到 Java 后端或数据库中，支持多设备重载。
- [ ] **验证场景 C：纯前端无后端交互应用**
  - **描述**：利用大模型直接生成 React 交互组件，并在右侧的 Live Preview 中无缝渲染（不依赖 Docker 沙箱）。
- [ ] **验证场景 D：定时与自动化任务 (Cron Automation)**
  - **描述**：模拟免输入定时拉取外部数据并更新界面的流程。
- [ ] **引入依赖管理机制**
  - **描述**：为生成的项目引入 `requirements.txt` 和 `package.json` 的自动解析与安装能力。

## ✅ 已完成 (Done)

- [x] **初始化顺序与持久化修复 (2026-04-13)**：修复 `ReferenceError: Cannot access 'files' before initialization`，将 `files` 的 LocalStorage 持久化拆分为独立 effect，避免 TDZ 触发白屏。
- [x] **场景 A 跑通**：接入阿里云千问 (qwen-plus) API，完成单轮问答与真实大模型回传渲染。
- [x] **API Key 生产级隔离**：实现前端剥离密钥，由 Java `ApiKeyManager` 注入并下发给 Go 数据面的 MVP 安全方案。
- [x] **Docker 温启动池优化**：Go 端维护常驻 `python:3.11-slim` 容器，解决冷启动延迟。
- [x] **文件目录树重构**：前端支持多层级文件夹（如 `src/agents`, `src/ui`）的展示与文件路由。
- [x] **架构演进白皮书**：确立 Anthropic MCP/Workflow 模式与 Obsidian 轻量级 RAG 的长期演进路线。
