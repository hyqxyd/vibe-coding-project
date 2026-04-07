# 超级 AI 员工与 Obsidian 知识图谱持久化记忆方案

## 1. 行业背景与痛点

### 1.1 字节跳动“超级 AI 员工”（如豆包·AI程序员）的启示
近期大厂（如字节跳动、Devin 等）推出的超级 AI 员工，与普通 Copilot（如 GitHub Copilot）的本质区别在于**“全工程感知”与“自主流转”**：
- **全工程感知**：不仅看当前文件，还能理解架构文档、历史 PR 决策、数据库 Schema 等上下文。
- **角色化与流转**：AI 具备明确的角色（Builder、Reviewer、Test Engineer），并在 Issue -> Branch -> PR -> Merge 整个生命周期中自主流转。

### 1.2 现有 AI 协作的痛点：上下文孤岛
在现有的 Vibe Coding 平台开发过程中，不同开发者的 AI 助手（Claude、GPT-4）之间存在“记忆隔离”：
- Alice 的 AI 修改了数据库结构，但 Bob 的 AI 不知道，导致 Bob 写代码时依然使用了旧的数据结构。
- 传统的全局文档（如 `README.md`）太长且容易过时，AI 每次读取消耗大量 Token 且找不到重点。

### 1.3 破局点：Obsidian 双向链接图谱
Obsidian 是著名的知识管理软件，其核心理念是**Markdown + 双向链接（`[[link]]`）+ 标签（`#tag`）**。
如果我们将这个理念引入 AI 的工作区（`.ai-collab` 目录），将其打造为一个“**机器与人共读的知识库（Vault）**”，就能完美解决 AI 的长效记忆问题。

---

## 2. Obsidian 记忆架构引入方案

我们将把当前的 `.ai-collab` 目录升级为一个 **Obsidian 兼容的 Vault（知识库）**。

### 2.1 目录结构升级
```text
.ai-collab/
├── 🗂️ 01-Agents/          # 记录 AI 角色的能力与设定 (如 Builder.md, Reviewer.md)
├── 🗂️ 02-Features/        # 记录各个功能模块的设计决策 (如 Auth.md, Workspace.md)
├── 🗂️ 03-Files/           # 记录核心文件的挂载点与修改意图
├── 🗂️ 04-Decisions/       # 记录重大技术决策 (ADR - Architecture Decision Records)
└── 🗂️ 05-Journals/        # 每日开发日志与合并快照 (Daily Notes)
```

### 2.2 核心机制：双向链接语法 (`[[ ]]`)
以后我们在记录记忆时，强制使用 Obsidian 的双链语法，让知识形成网状图谱。

**例子：开发日志 (`05-Journals/2026-04-06.md`)**
```markdown
# 2026-04-06 协同开发记录

- 开发者: @Alice, AI: [[Claude-Code-01]]
- 变更模块: [[Workspace.md]] (沙箱调度模块)
- 核心修改: 在 Go 层增加了 `StartWorkspace` gRPC 接口，对应决策见 [[ADR-005-CQRS架构分离]]。
- 风险点: 依赖了最新的 Redis Stream 消费者，需要通知 [[AI-Test-Engineer]] 进行集成测试。
```

### 2.3 标签系统 (`#tag`) 与属性检索 (Properties)
在 Markdown 文件头部使用 YAML Frontmatter 记录元数据，方便 Python 脚本或 RAG 向量数据库快速解析。

**例子：功能模块记忆 (`02-Features/Workspace.md`)**
```markdown
---
status: in_progress
owner: @Alice
risk_level: high
tags:
  - #go
  - #docker
---
# Workspace 沙箱调度
当前该模块由 [[Claude-Code-01]] 维护。最新修改记录见 [[2026-04-06]]。
```

---

## 3. 架构落地与“超级 AI 员工”的联动流转

引入 Obsidian 图谱记忆后，我们的 CQRS 后端架构（Java + Go）中将增加一个“**记忆治理引擎**”。

### 3.1 AI 员工的标准工作流（RAG + Graph）

1. **唤醒与检视（Retrieve）**：
   - 当人类开发者让 AI 开始一个新功能（如“修改权限校验逻辑”）时。
   - AI 首先通过脚本检索 `.ai-collab/02-Features/Auth.md`。
   - 沿着 `[[双向链接]]`，AI 自动顺藤摸瓜，读取到最近相关的 `[[ADR-002-RBAC设计]]` 和 `[[2026-04-05]]` 的开发日志。
2. **执行与记录（Execute & Write）**：
   - AI 编写代码（Go/Java）。
   - 完成后，AI 必须主动更新对应的 Obsidian Markdown 文件，添加新的双链和标签。
3. **评审与流转（Review & Route）**：
   - 本地 `pre-push` Git Hook 触发。
   - **AI Reviewer** 读取本次改动的代码和新的 Obsidian 日志。
   - 评审通过后，在 `05-Journals` 中打上 `#reviewed` 标签，允许合并。

### 3.2 工具链支持
为了让这套机制不仅是“写文档”，而是可编程的自动化流程，我们将补充以下脚本能力：
- `scripts/ai_collab/obsidian_graph_builder.py`：自动解析所有 `.md` 文件的双链关系，生成类似 Obsidian 的节点依赖 JSON 供 AI 全局参考。
- `scripts/ai_collab/broken_link_checker.py`：在 CI/CD 阶段检查是否有死链（比如引用了 `[[Auth.md]]` 但文件不存在），确保 AI 记忆图谱的健康。

---

## 4. 团队协同：如何让全员共享这套 Obsidian 记忆？

由于我们的 `.ai-collab` 本身就在 Git 代码仓库中，所以**基于 Git 的同步方案**是成本最低、最适合研发团队的做法。

### 4.1 团队成员接入步骤

1. **拉取代码库**：人类开发者正常通过 `git clone` 或 `git pull` 获取最新的项目代码（包含 `.ai-collab` 目录）。
2. **配置 Obsidian 客户端**：
   - 下载并安装 [Obsidian](https://obsidian.md/)。
   - 点击 **“打开文件夹作为仓库 (Open folder as vault)”**，选择项目根目录下的 `.ai-collab` 文件夹。
3. **安装与配置 Obsidian Git 插件（强烈推荐）**：
   - 在 Obsidian 设置 -> 第三方插件中，关闭“安全模式”。
   - 搜索并安装 **Obsidian Git** 插件（作者：Denis Olegov）。
   - **核心自动同步设置（重要）**：
     - `Auto commit-and-sync interval (minutes)`: 设为 **10**（每 10 分钟自动后台提交并推送）。
     - `Auto commit-and-sync after stopping file edits`: **打开**（防止打字打一半提交）。
     - `Pull on startup`: **打开**（每次打开自动拉取队友最新记忆）。
     - `Auto commit-and-sync only staged files`: **保持关闭**（确保只提交 `.ai-collab` 目录，不影响外部业务代码）。
   - **关于提交规范与门禁（无需修改）**：
     - 插件默认提交信息为 `vault backup: {{date}}`。
     - 项目底层的 Git 门禁（`commit-msg` hook）已经对该格式加入了**白名单免检机制**，不会与业务代码的 `type(scope): subject` 规范产生冲突，直接开箱即用即可，**无需配置 Advanced 选项中的任何 Git 路径**。

### 4.2 防冲突与 `.gitignore` 最佳实践

Obsidian 会在仓库下生成 `.obsidian` 隐藏文件夹用于存放配置，为了避免每个人界面布局不同导致的 Git 冲突，我们必须在项目的 `.gitignore` 中添加以下规则：

```gitignore
# Obsidian 个人工作区与缓存（禁止同步）
.ai-collab/.obsidian/workspace.json
.ai-collab/.obsidian/workspace-mobile.json
.ai-collab/.obsidian/cache/
```
*注：我们允许同步 `.ai-collab/.obsidian/plugins/`，这样一个人装了 Git 插件或图谱强化插件，全队都能自动用上。*

### 4.3 人机协同的日常体验

- **看全景**：新员工入职或 Reviewer 审查代码时，打开 Obsidian 的**关系图谱（Graph View）**，立刻能看到当前哪个模块（节点）最大、被修改得最频繁，哪里是冲突高发区。
- **无缝冲突解决**：因为本质是 Markdown 纯文本，两人（或两个 AI）同时修改了一篇日志，Git 能自动 Merge 绝大部分非同行修改；遇到真冲突，在 VSCode 或 IDE 里解决即可。
- **移动端打通（可选）**：如果主管想在手机上看开发进展，iOS 可以用 Working Copy 挂载 Git 仓库，Android 可以用 Termux，直接用手机版 Obsidian 无缝查看。

---

## 5. 给开发团队的建议

1. **把 AI 当作同事**：
   - 不要在代码里用长篇大论的注释解释架构，而是写 `// 详细决策见 [[ADR-005]]`。
   - 让 AI 养成习惯：遇到不确定的点，主动在 Obsidian 日志里 `@` 对应的人类 Owner。
2. **随手记录，让机器去连线**：
   - 开发者不用费力去整理目录结构，只要在写 Markdown 时随手打上 `[[关键字]]` 和 `#tag`，图谱就会自动生长，成为超级 AI 员工最强大的上下文来源。
