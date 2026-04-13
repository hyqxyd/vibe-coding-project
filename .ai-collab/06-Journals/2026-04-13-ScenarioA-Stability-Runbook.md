# 2026-04-13 Scenario A 稳定性收口与演示准备

## 关联
- 架构背景：[[06-Journals/2026-04-09-Security-and-Copilot-Architecture]]
- 协议决策：[[04-Decisions/ADR-001-Workspace-gRPC-Contract]]
- 图谱入口：[[01-Knowledge-Graph]]

## 问题与修复

### 前端改动
- 修复 `ReferenceError: Cannot access 'files' before initialization`
  - 根因：在 `files` 声明前的 `useEffect` 依赖中提前访问了 `files`（TDZ）。
  - 修复：将 `files` 持久化拆分为独立 `useEffect`，并放到 `files` 声明之后。
- 增加工作区本地持久化
  - 内容：`nodes / edges / files / chatMessages` 写入 `localStorage`，刷新后自动恢复。
- 增加后端就绪拦截
  - 页面启动先请求控制面 `workspace/start`，未就绪时禁用执行按钮并显示状态。

### 后端改动
- 新增控制面代理接口：`/api/v1/gateway/chat/completions`
  - 作用：前端不再直连外部模型 API，由控制面统一转发。
- 新增 `ApiKeyManager`
  - 作用：统一管理并注入模型密钥，前端不暴露 Key。

## 代码改动清单（关键文件）
- `frontend-platform/src/App.tsx`
  - 持久化恢复、初始化顺序修复、后端就绪状态控制。
- `backend-control-plane/src/main/java/com/vibecoding/controlplane/controller/ApiProxyController.java`
  - 模型代理网关。
- `backend-control-plane/src/main/java/com/vibecoding/controlplane/service/workspace/ApiKeyManager.java`
  - 密钥管理组件。
- `backend-control-plane/src/main/java/com/vibecoding/controlplane/controller/WorkspaceController.java`
  - 执行链路与注入逻辑联动调整。
- `backend-data-plane/service/workspace.go`
  - 运行与池化联调相关调整。

## 演示前联调清单
- 端口检查：`5173`（前端）、`8080`（控制面）、`50051`（数据面）
- 全链路检查：`Deploy -> Generate -> Docker 执行 -> Output_3.json 回填`
- 回退方案：
  - 前端异常：清理 `localStorage` 后刷新。
  - 数据面异常：确认 Docker Desktop 运行并重启 Go 服务。

