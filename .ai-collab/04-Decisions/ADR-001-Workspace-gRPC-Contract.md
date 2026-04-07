---
status: accepted
owner: @AI-Builder
date: 2026-04-07
tags:
  - #grpc
  - #contract
  - #architecture
---

# ADR-001 Workspace 沙箱 gRPC 通信契约设计

## 1. 背景与意图

在 Vibe Coding 平台的 CQRS 混合微服务架构中（详见 [[02-技术方案.md]]），我们需要解决核心的跨服务通信问题：
- **发起方**：Java (Spring Boot 控制面)，它掌握学生权限和业务调度。
- **执行方**：Go (数据面)，它掌握 Docker 宿主机和高并发终端流。

当 Java 判断某个学生需要上课写代码时，它必须能可靠地命令 Go **拉起一个独立的沙箱容器（Workspace）**，并拿到容器的终端 WebSocket 代理地址（PTY），以便交还给前端学生使用。

## 2. 架构决策

我们决定采用 **gRPC + Protobuf** 的方案进行两端同步通信，并实行“契约优先 (Contract-First)”的开发模式。

- 契约管理库：统一存放在 `proto-contracts/` 目录下。
- 定义的服务：`WorkspaceService`（沙箱生命周期服务）。

### 2.1 接口设计与作用边界

本次定义了四个核心接口，确保 Java 控制面完全掌握生命周期，但不涉及任何底层的容器调度细节：
1. **StartWorkspace**: Java 传递业务参数（`student_id`, `base_image`, 内存/CPU 限制），Go 负责调用 Docker API 拉起容器，并返回底层的 `container_id` 和暴露给前端直连的 `pty_ws_url`。
2. **StopWorkspace**: 挂起容器。
3. **GetWorkspaceStatus**: 心跳检测与状态同步。
4. **DestroyWorkspace**: 强杀容器并清理资源。

> 具体的字段设计和枚举状态详见源码文件：`proto-contracts/vibe/workspace/v1/workspace.proto`。

## 3. 后续影响（Next Steps）

1. **Java 控制面影响**：需要引入 `grpc-spring-boot-starter` 和 `protobuf-maven-plugin` 生成桩代码（Client），作为 `WorkspaceDaemonClient` 接口的实现。
2. **Go 数据面影响**：需要使用 `protoc-gen-go` 和 `protoc-gen-go-grpc` 生成服务端骨架，实现 `WorkspaceServiceServer` 接口，对接底层的 Docker SDK。
3. **测试影响**：需通知 [[AI-Test-Engineer]] 根据这套 `.proto` 准备两端的 Mock 测试用例。
