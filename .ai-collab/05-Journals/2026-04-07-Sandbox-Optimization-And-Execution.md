---
tags: [沙箱, docker, 代码执行, 优化, 异常恢复]
date: 2026-04-07
related_files:
  - "[[backend-data-plane/service/workspace.go]]"
  - "[[backend-control-plane/src/main/java/com/vibecoding/controlplane/service/workspace/GrpcWorkspaceClientImpl.java]]"
  - "[[proto-contracts/vibe/workspace/v1/workspace.proto]]"
  - "[[02-技术方案]]"
---

# 2026-04-07-沙箱轻量化与代码执行机制

## 🎯 变更意图 (Intent)
1. 解决原先采用 `ubuntu:latest` 基础镜像导致的学生个人沙箱内存和存储消耗过大、启动缓慢的问题。
2. 建立从前端 -> Java 控制面 -> Go 数据面 -> Docker 容器内部的全链路代码分发和执行管道。
3. 提供工业级的异常兜底：当沙箱因为 OOM 等原因意外销毁时，用户执行代码时能实现“惰性自愈”。

## 🛠️ 核心实现 (Implementation)

### 1. 轻量化与自清理 (Lightweight & Auto-Cleanup)
* 将基础镜像切换至了 **`alpine:latest`**，配合 `tail -f /dev/null` 挂起容器。
* 在 [[backend-data-plane/service/workspace.go]] 中配置了 `AutoRemove: true`，容器一停自动销毁。

### 2. 纯内存代码推流 (In-Memory File Transfer)
* 新增 gRPC 接口 `ExecuteCode`，详见 [[proto-contracts/vibe/workspace/v1/workspace.proto]]。
* 不将文件落盘，而是利用 Go 的 `archive/tar` 动态在内存构建 Tar 流，利用 Docker API `CopyToContainer` 推入容器，详见 [[backend-data-plane/service/workspace.go]]。

### 3. 惰性自愈兜底 (Auto-Recovery)
* 如果沙箱已死，执行代码时会拦截请求，自动创建并启动一个新的干净沙箱再注入代码。

## 💡 经验沉淀 (Learnings)
不要为隔离环境配置完整的 OS 镜像，尽可能向 `alpine` 或 `busybox` 靠拢；代码流转必须保证容器的“无状态”特性，使得自愈成为可能。详细规则记录在了 [[.learnings/LEARNINGS.md]] 中。