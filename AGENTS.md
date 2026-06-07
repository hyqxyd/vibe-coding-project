# AGENTS.md

## Cursor Cloud specific instructions

### 产品概览

课堂 Vibe Coding 平台：CQRS 微服务架构，包含 React 前端（5173）、Java Spring Boot 控制面（8080）、Go gRPC 数据面（50051）。完整 E2E 还需 Docker Engine 与 `python:3.11-slim` 镜像。

### 系统依赖（VM 镜像层，不在 update script 中）

- **Go 1.26+**：`go.mod` 要求 `go 1.26.1`；系统 apt 自带的 Go 1.22 不够。安装：`/usr/local/go`（见 [go.dev/dl](https://go.dev/dl/)），并确保 `PATH` 含 `/usr/local/go/bin`。
- **Java 17+**：控制面使用 `./mvnw`（首次需 `chmod +x backend-control-plane/mvnw`）。
- **Docker**：数据面沙箱依赖 Docker。Cloud VM 嵌套环境需 fuse-overlayfs 存储驱动，并手动启动 `dockerd`（见下方）。

### Docker 在 Cloud VM 中的启动

嵌套 VM 中 systemd 可能无法自动启动 Docker。每次新会话若 `docker info` 失败：

```bash
sudo mkdir -p /etc/docker
printf '%s\n' '{' '  "storage-driver": "fuse-overlayfs"' '}' | sudo tee /etc/docker/daemon.json
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
sudo dockerd > /tmp/dockerd.log 2>&1 &
sleep 3
sudo chmod 666 /var/run/docker.sock   # 或 sudo usermod -aG docker $USER
docker pull python:3.11-slim
```

**已知限制**：嵌套 VM 的 cgroup v2 处于 threaded 模式时，带 `--memory` 限制的容器（数据面 WarmPool 默认 512MB）会启动失败。无内存限制的 `docker run` 可正常工作。全链路「Deploy → Docker 执行」在标准 Cloud VM 上可能受阻；前端 + 控制面 + LLM 代理仍可验证。

### 启动服务（三个独立终端 / tmux 会话）

| 服务 | 目录 | 命令 | 端口 |
|------|------|------|------|
| 数据面 | `backend-data-plane` | `go run .` | gRPC `50051` |
| 控制面 | `backend-control-plane` | `./mvnw spring-boot:run` | HTTP `8080` |
| 前端 | `frontend-platform` | `npm run dev -- --host 0.0.0.0` | HTTP `5173` |

无根目录 `docker-compose`；须分别启动。标准命令见各模块及 `TODO.md` 场景 A 联调清单。

### 测试与 Lint

| 模块 | 命令 | 说明 |
|------|------|------|
| 控制面单元测试 | `cd backend-control-plane && ./mvnw test` | 无需全栈 |
| 前端 lint | `cd frontend-platform && npm run lint` | 当前仓库存在若干未使用变量等既有 lint 问题 |
| 前端 build | `cd frontend-platform && npm run build` | 同样有既有 TS 未使用变量错误 |
| LLM 代理冒烟 | `curl -X POST http://localhost:8080/api/v1/gateway/chat/completions -H 'Content-Type: application/json' -d '{"model":"qwen-plus","messages":[{"role":"user","content":"你好"}]}'` | 需 `KIMI_API_KEY` 或 `application.yml` 默认 key |

### 环境变量

- `KIMI_API_KEY`：阿里云 DashScope（控制面 LLM 代理与沙箱注入）
- `OPENAI_API_KEY` / `OPENAI_BASE_URL`：Spring AI 预留配置

### Git Hooks

`.githooks/pre-push` 会运行 Python 门禁脚本；推送前需 Python 3 可用。
