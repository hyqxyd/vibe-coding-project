---
title: Java 控制面联调与架构落地
date: 2026-04-07
tags:
  - backend
  - java
  - grpc
  - spring-boot
---

# Java 控制面联调日志

## 摘要
在保留全局系统 Java 8 的前提下，配置了专用的 `run-mvn` 隔离脚本，使用 Java 23 成功编译了 Java 控制面，并实现了 `WorkspaceController` 以触发 Go 数据面的沙箱容器管理。

## 详细步骤
1. **依赖与环境隔离**
   - 编写 `run-mvn.cmd` 和 `run-mvn.ps1`，确保仅在该项目内临时使用 Java 23 编译环境。
   - 解决版本冲突：将 Spring AI 升级到 `1.0.0-M1` 以适配新的 `ChatClient` 语法，降级 gRPC 版本并排除 `grpc-netty-shaded` 冲突。

2. **REST API 与安全放行**
   - 创建了 `WorkspaceController`，提供了 REST API（例如 `POST /api/v1/workspace/start`）作为 HTTP 触发点。
   - 配置 `SecurityConfig`，针对 `/api/v1/workspace/**` 路径关闭 CSRF 拦截并执行放行，便于开发调试。

3. **双栈联调结果**
   - 启动 Java (8080) 与 Go (50051) 服务，使用 `Invoke-RestMethod` 进行联调。
   - 请求成功从 Java 传递至 Go，Go 控制台准确抛出 `error during connect`。
   - 结论：**HTTP (前端) -> Java (控制面) -> gRPC 协议 -> Go (数据面)** 链路完全打通，只差真实 Docker 环境即可成功启动容器。

## 后续动作
- [ ] 开发人员在宿主机开启 Docker Desktop。
- [ ] 验证容器的拉取与真实启动。
- [ ] 实现 WebSocket 的 PTY (伪终端) 数据流代理转发。