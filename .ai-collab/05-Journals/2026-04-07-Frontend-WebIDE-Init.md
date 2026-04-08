---
tags: [前端, React, Monaco, Xterm, WebIDE]
date: 2026-04-07
related_files:
  - "[[frontend-platform/src/App.tsx]]"
  - "[[frontend-platform/src/components/CodeEditor.tsx]]"
  - "[[frontend-platform/src/components/TerminalPanel.tsx]]"
  - "[[08-教师端页面蓝图]]"
---

# 2026-04-07-搭建前端 Web IDE 界面

## 🎯 变更意图 (Intent)
为了让我们的沙箱机制有直观的操作入口，我们需要根据 [[08-教师端页面蓝图]] 搭建前端页面。本次任务初始化了 `frontend-platform`，搭建了基本的代码编辑器和控制台面板，打通了前后端的执行链路。

## 🛠️ 核心实现 (Implementation)

### 1. 基础工程初始化
* 使用 `Vite` + `React` + `TypeScript` 搭建了名为 `frontend-platform` 的项目骨架。
* 引入并配置了 `TailwindCSS` 用于快速构建深色主题 UI。

### 2. 核心组件集成
* **Monaco Editor**：集成了 `@monaco-editor/react` 作为核心代码编辑区（[[frontend-platform/src/components/CodeEditor.tsx]]），提供了类似 VS Code 的高亮和代码补全体验，默认加载 Java 语言模板。
* **Xterm.js**：集成了 `@xterm/xterm` 并在 [[frontend-platform/src/components/TerminalPanel.tsx]] 中封装了终端面板，用于展示从后端返回的 stdout/stderr 结果流。

### 3. 前后端联调 (Integration)
* 在主入口 [[frontend-platform/src/App.tsx]] 中，对接了 Java 控制面的两个核心 API：
  1. `POST /api/v1/workspace/start`：懒加载创建沙箱。
  2. `POST /api/v1/workspace/{id}/execute`：获取 Monaco 编辑器的代码文本，组装为执行 Payload 发送到沙箱执行，并将返回结果打印到 Xterm 终端。

## 💡 经验沉淀 (Learnings)
Monaco Editor 和 Xterm 结合 Tailwind 能够非常快速地搭建出形似 VS Code 的工作流。目前的执行结果是轮询或单次返回，如果后续需要交互式的输入，我们需要将 HTTP API 升级为真实的 WebSocket + PTY 通信，这将在后续节点迭代。