## [LRN-20260407-001] best_practice

**Priority**: high
**Status**: resolved
**Area**: infra

### 内容
简述：之前在沙箱环境设计中，为每个用户（Workspace）拉起了一个完整的 `ubuntu:latest` 镜像作为基础容器。用户纠正指出：给每个人创建一个完整的 Ubuntu 镜像资源消耗太大，非常不合理。
正确的做法：在构建沙箱或隔离环境时，应尽可能使用轻量级的基础镜像（如 `alpine:latest` 或 `busybox`），从而大幅度降低内存和存储消耗，提升沙箱拉起速度。

### 建议修复
修改 Go 数据面（`backend-data-plane`）创建容器的代码，将基础镜像从 `ubuntu:latest` 替换为 `alpine:latest`，同时调整容器启动命令以适配 alpine 环境（如使用 `tail -f /dev/null`）。

### 元数据
- Source: correction
- See Also: 
- Pattern-Key: sandbox-image-optimization

---
