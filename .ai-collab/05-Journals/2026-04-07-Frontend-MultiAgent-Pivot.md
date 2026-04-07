---
tags: [前端架构, 多智能体, ReactFlow, Pivot, VibeCoding]
date: 2026-04-07
related_files:
  - "[[frontend-platform/src/App.tsx]]"
  - "[[frontend-platform/src/components/AgentFlowCanvas.tsx]]"
  - "[[frontend-platform/src/components/AiChatPanel.tsx]]"
---

# 2026-04-07-前端架构升级：从IDE到多智能体画布

## 🎯 核心架构转折 (Pivot)
用户澄清了 Vibe Coding 平台的真实愿景：它**不是**一个类似于 LeetCode 的简单代码运行环境（左边写代码右边看终端），而是一个**基于大模型的“多智能体（Multi-Agent）可视化编排与生成平台”**。

## 🛠️ 新架构蓝图 (New Architecture)
为了满足这一愿景，我们将前端 UI 进行了彻底重构，引入了以下四大核心模块：

### 1. AI 聊天助理区 (AI Chat Panel)
- **位置**：左侧边栏。
- **职责**：学生在这里用自然语言描述需求（如“帮我写一个处理数据的智能体”）。AI 在收到指令后，会在右侧的画布中自动生成对应的 Agent 节点和连线。

### 2. 多智能体画布区 (Agent Flow Canvas)
- **位置**：中心主要区域。
- **技术栈**：引入了 `@xyflow/react` (React Flow)。
- **职责**：可视化展示各个 Agent 节点及其流转关系。学生既可以通过拖拽连线手动编排，也可以看着 AI 自动构建图谱。

### 3. 节点配置与日志区 (Config & Terminal)
- **位置**：右侧边栏。
- **职责**：
  - 当在画布中选中某个 Agent 节点时，这里会展示该节点的内部细节（如 Prompt、Python/Java 代码）。
  - 下方保留了 `TerminalPanel`，用于输出该节点在后端沙箱中运行的真实日志（依赖之前写好的 ExecuteCode 机制）。

### 4. 动态 UI 预览区 (Dynamic UI Preview)
- **位置**：与 Flow 画布平级的 Tab 切换页。
- **职责**：学生在编排好后端 Agent 逻辑后，可以让 AI 再写一个前端页面接入这些 Agent。此区域用于实时渲染和交互这个 AI 生成的最终 Web App。

## 💡 战略意义 (Impact)
这次 Pivot 让我们彻底对齐了当下最前沿的 AI 应用开发范式（类似 Dify / Coze 的底层逻辑），同时也让我们的底层沙箱机制找到了真正强大的用武之地：**沙箱不再是用来跑 HelloWorld 的，而是用来跑学生编排出来的每一个独立 Agent 的！**