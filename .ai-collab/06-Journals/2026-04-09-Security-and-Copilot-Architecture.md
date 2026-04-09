# Vibe Coding: 生产级安全架构与多智能体 Copilot 设计

## 1. 生产级 API Key 管理机制 (MVP -> 终极)

在教育或 C 端场景中，防盗刷是核心底线。我们需要通过 Java 控制面实现大模型 API 的安全代理与沙箱隔离。

### MVP 阶段（当前落地）
**目标**：前端剥离密钥，实现前后端分离，在内存中动态注入。
- **架构流转**：
  1. `VITE_KIMI_API_KEY` 从前端彻底移除。
  2. Java 控制面 `ApiKeyManager` 从 Spring Boot 的 `application.yml` 或系统环境变量读取官方 Key。
  3. 当学生在前端点击执行触发 `POST /execute` 时，Java 拦截请求，将真实的 API Key 组装为 `src/data/config.json`（或环境变量）塞入给 Go Data Plane 的 gRPC 请求中。
  4. Go 在分配出的沙箱内拉起代码，Python 脚本读取该配置调用大模型。执行完毕容器销毁，不留痕迹。
- **缺陷**：容器内的恶意代码依然可以通过打印环境变量盗取 Key。

### 生产阶段（长期规划）
**目标**：绝对沙箱隔离、多用户密钥池轮询与计费管控。
- **架构流转 (API Proxy Gateway)**：
  1. Java 控制面启动内部代理网关（例如 `http://control-plane:8080/v1/chat/completions`），不对公网暴露。
  2. Go 数据面的 Docker 容器被配置为 **禁止访问公网大模型域名**。学生沙箱内的 Python Agent 只能将请求发送到 Java 网关。
  3. Java 网关根据发来请求的沙箱 ID，识别所属学生。
  4. 查询 MySQL `student_quota` 表扣除配额，并从 `api_keys_pool` 提取真实 Key。
  5. 替换请求 Header，由 Java 网关向阿里云/OpenAI 转发并回传。
  
---

## 2. AI 编程助手 (Copilot) 多智能体复杂架构设计

为了实现轻量级但强大的 Vibe Coding 体验，左侧的“AI 编程助手”本身不应该只是一个单轮对话大模型，而应该是一个 **Multi-Agent 协作编排系统**。

### 核心子 Agent 划分：
1. **意图分析 Agent (Intent Analyzer)**
   - **职责**：理解用户的自然语言输入（如：“帮我加一个翻译 Agent” 或 “页面背景改成蓝色”）。
   - **输出**：分类指令，是去修改【工作流拓扑结构】，还是修改【UI 代码】，或者仅仅是【日常问答】。
2. **架构规划 Agent (Flow Architect)**
   - **职责**：如果判定为拓扑结构变更，结合当前的 `nodes` 和 `edges`，生成新增/删除的节点和连线 JSON。
3. **代码生成 Agent (Code Writer)**
   - **职责**：如果是生成新的处理逻辑（如 Python 数据清洗脚本）或修改 React UI（如 `SocialMediaCard.tsx`），它会根据上下文编写完整、可执行的代码文件。
4. **记忆与状态管理 Agent (Memory Manager)**
   - **职责**：维护“用户上下文”和“当前项目状态”。利用前端 Zustand/Redux 或后端 Redis 记录用户的历次修改记录，使得 AI 不会“忘掉”前文。

### 工作流协同：
`User Input -> Intent Analyzer -> (Flow Architect || Code Writer) -> Memory Manager -> JSON Update -> React Flow Rendering`

这样，AI 编程助手就能准确地理解：用户要的是一个新的流程图节点，还是仅仅修改一下 UI 卡片的背景颜色。

---

## 3. Anthropic 架构启示与 Obsidian 轻量级 RAG 记忆库

为了构建一个“轻量但专业”的 Vibe Coding AI 助手，我们深度借鉴了 **Anthropic (Claude) 的 Agent 设计模式** 以及 **MCP (Model Context Protocol)**，并创新性地使用 **Obsidian 知识库** 替代传统的向量数据库。

### 3.1 借鉴 Anthropic Agent 设计模式 (Building Effective Agents)
根据 Anthropic 最新的研究，在真实的生产环境中，复杂的“全自动循环 Agent (Autonomous Loops)”往往不可控且易陷入死循环。我们采用他们推荐的 **Workflows (工作流模式)**：
1. **Routing (路由分发)**：接收用户请求后，由一个轻量模型（如 qwen-plus）判断意图，将任务精准分发给特定的下游 Agent（比如：只改代码的 Code Writer，或只搜资料的 Searcher）。
2. **Orchestrator-Worker (编排者-打工人)**：针对复杂任务，主 Agent (Orchestrator) 会拆解任务，生成一个执行计划（Plan），然后交给并行的 Worker Agent 去执行代码修改，最后由 Orchestrator 汇总（正如我们目前的 Vibe Coding 流程图所展示的）。
3. **MCP (Model Context Protocol) 赋能 Skills**：
   - 我们的 AI 助手不应该把所有的工具（文件读写、网页搜索、终端执行）都硬编码在自身。
   - 我们将采用标准的 MCP 协议：开发一个独立的 `File-System MCP Server` 和 `Docker-Execution MCP Server`。AI 助手（Client）通过标准协议调用这些“技能 (Skills)”，实现能力的无限扩展与解耦。

### 3.2 抛弃向量库，采用 Obsidian 轻量级 RAG
在个人或中小型项目的上下文中，传统的 Vector DB（如 Milvus / Qdrant）太重、黑盒且维护成本高。我们将采用基于 **Obsidian (Markdown 文本库)** 的本地化记忆管理：<mccoremem id="03fwhw0xe5xd5s1fe91zgobpt" />

1. **白盒化与用户可干预**：
   - 所有的知识库、项目上下文、开发约定（Rules）都以纯文本 `.md` 文件的形式存放在服务器的某个专属目录（如 `workspace/obsidian_vault/`）下。
   - 用户甚至可以直接在界面上打开并阅读/修改这些 Markdown 文件，实现了 AI 记忆的 100% 透明度。
2. **基于 Wikilinks (`[[...]]`) 的图谱关联**：
   - 当 AI 总结了一段关于“UI 设计”的记忆时，它会自动在文中生成 `[[TailwindCSS 规范]]` 或 `[[SocialMediaCard 组件]]` 这样的双向链接。
   - 这天然构成了一个**知识图谱 (Knowledge Graph)**。
3. **轻量级 RAG 检索 (Grep + BM25)**：
   - 当用户询问某个模块时，系统不需要计算 Embedding 向量，而是直接利用快速的全文检索（如 Ripgrep）或基于文件名的精确匹配，找到相关的 `.md` 文件。
   - 通过解析 Markdown 文件中的 `[[双向链接]]`，连带提取相关的周边上下文文件，拼接给大模型。
   - 这种方法不仅 Token 成本极低，而且召回的上下文完全符合人类的逻辑关联（因为链接是按业务逻辑显式声明的）。

**总结**：通过 **Anthropic 的显式工作流 + MCP 技能解耦 + Obsidian 纯文本记忆图谱**，我们能够以极低的资源开销，构建出一个高度可控、极度透明、且上下文永不丢失的专业级 AI Code Copilot。