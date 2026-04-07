# 课堂 Vibe Coding 平台 (Vibe Coding Platform)

> 这是一个面向教育场景的多人协同与 AI 辅助编程平台。

## 🏛️ 项目架构与目录结构

本项目采用 **CQRS（命令查询职责分离）多语言混合微服务架构**，将复杂的业务逻辑/AI 编排与高并发的底层容器/长连接调度进行物理隔离。

```text
vibe-coding-project/
├── 📁 backend-control-plane/  # 【控制面】Java (Spring Boot + Spring AI)
│   # 核心职责：用户鉴权、课程与作业管理、权限 RBAC、多 AI 角色协同编排、记忆库与 RAG 检索。
│
├── 📁 backend-data-plane/     # 【数据面】Go (Golang)
│   # 核心职责：Workspace Daemon（沙箱容器管理）、代码实时同步服务、终端 PTY 输入输出流代理。
│
├── 📁 frontend-platform/      # 【平台前端】TypeScript (React + Vite)
│   # 核心职责：学生端工作台、教师端实时看板、流程图与代码差异比对、WebSocket 通信。
│
├── 📁 proto-contracts/        # 【跨服务契约】Protobuf (.proto)
│   # 核心职责：统一管理 Java 与 Go 之间的 gRPC 接口契约与消息结构。
│
├── 📁 docs/                   # 架构设计与业务分析文档库
├── 📁 scripts/                # CI/CD 与本地工程化脚本 (Python/Bash)
└── 📁 .ai-collab/             # 🤖 AI 协同持久化记忆库 (Obsidian Vault)
```

## 🛠️ 开发与协作指南

1. **AI 协同与架构规范**：
   - 跨语言通信与代码规范请遵循：[`docs/03-微服务通信与代码规范.md`](docs/03-微服务通信与代码规范.md)。
   - 本项目通过 Git Hook 实现了严格的 AI 自动代码审查与记忆图谱更新，详情见：[`docs/04-超级AI员工与Obsidian持久化记忆方案.md`](docs/04-超级AI员工与Obsidian持久化记忆方案.md)。

2. **团队成员入场（Obsidian 知识库）**：
   - 强烈建议团队成员使用 Obsidian 打开本项目根目录，以获取完整的项目知识图谱、架构设计关联与防冲突支持。
   - 建议在 Obsidian 中安装 `Obsidian Git`, `Dataview` 和 `Excalidraw` 插件以提升协作体验。

3. **提交规范**：
   - 本项目严格遵循 `type(scope): subject` 的 Git 提交规范（支持 `feat`, `fix`, `docs`, `refactor`, `chore` 等）。
   - 门禁脚本会自动拦截不合规的提交（Obsidian 的后台自动备份除外）。

## 🚀 模块初始化说明（建设中）

各模块的脚手架代码正在逐步初始化中。后续如需本地启动服务，请进入对应子目录查看专属的 `README.md`。
