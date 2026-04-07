# 跨服务通信契约 (Proto Contracts)

> 本目录用于管理 Vibe Coding 平台微服务架构中的跨语言接口定义文件（Protobuf）。

## 目录规范
遵循大厂常见的包结构，按 `公司域/业务域/版本号` 划分：
```text
vibe/
└── workspace/           # 沙箱工作空间域
    └── v1/              # 版本隔离
        └── workspace.proto  # 沙箱生命周期服务接口
```

## 核心接口：WorkspaceService (v1)

定义了 **Java 控制面** 下发给 **Go 数据面** 的四个核心指令：
1. `StartWorkspace`: 拉起学生专属的沙箱容器，返回 WebSocket PTY 地址供前端直连。
2. `StopWorkspace`: 暂停沙箱，保留数据。
3. `GetWorkspaceStatus`: 查询健康状态。
4. `DestroyWorkspace`: 销毁并回收系统资源。

## 编译指南（规划中）

后续将在这里提供 `protoc` 生成 Java 客户端桩代码和 Go 服务端桩代码的具体命令或 Maven/Makefile 配置。
