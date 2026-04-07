---
title: Go 数据面初始化与 Docker SDK 对接
date: 2026-04-07
tags:
  - backend
  - go
  - grpc
  - docker
---

# Go 数据面初始化日志

## 摘要
完成了 `backend-data-plane` (Go) 的初始化工作，生成了与 Java 控制面通信的 gRPC 桩代码，并使用 Go Docker SDK 实现了沙箱的生命周期管理接口。

## 详细步骤
1. **模块初始化**
   在 `backend-data-plane` 目录下执行了 `go mod init`，安装了以下核心依赖：
   - `google.golang.org/grpc`
   - `github.com/docker/docker` (v25.0.3)

2. **Protobuf 桩代码生成**
   安装了 `protoc-gen-go` 和 `protoc-gen-go-grpc` 工具。
   根据 `proto-contracts/vibe/workspace/v1/workspace.proto` 契约，生成了 Go 语言的 `workspace.pb.go` 和 `workspace_grpc.pb.go`，存放在 `api/workspace/v1` 目录下。

3. **gRPC 服务与 Docker 调度**
   - 创建了 `WorkspaceService`，实现了 `pb.WorkspaceServiceServer` 接口。
   - 使用 Docker SDK (`client.NewClientWithOpts`) 与宿主机 Docker Daemon 建立连接。
   - 实现了以下生命周期操作：
     - `StartWorkspace`: 创建并启动指定资源限制的容器，返回 Mock 的 PTY WebSocket URL。
     - `StopWorkspace`: 停止指定沙箱容器。
     - `GetWorkspaceStatus`: 查询沙箱容器的状态。
     - `DestroyWorkspace`: 强制删除沙箱容器。

4. **主入口 (main.go)**
   在 `main.go` 中启动了 gRPC 服务监听 `50051` 端口，并注册了反射服务 (`reflection.Register`) 以便后续使用 `grpcurl` 调试，同时加入了优雅停机逻辑。

## 后续计划
- [ ] 在 Java 控制面中配置对该 Go 服务的 gRPC Client 调用。
- [ ] 联调测试 Java 触发 Go 启动真实的 Docker 容器。
- [ ] 实现真实的 PTY 终端 WebSocket 代理转发。