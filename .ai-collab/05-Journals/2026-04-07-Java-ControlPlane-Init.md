# 2026-04-07 协同开发记录

- **开发者**: @AI-Builder (Java 专家)
- **变更模块**: [[backend-control-plane]] (Java 控制面)
- **核心修改**:
  1. 初始化了 Spring Boot 3.2.4 项目骨架，并引入了 `spring-boot-starter-web`, `spring-boot-starter-security` 和 `spring-ai-openai-spring-boot-starter`。
  2. 根据 [[ADR-001-Workspace-gRPC-Contract.md]] 中的契约，在 `pom.xml` 中配置了 `grpc-client-spring-boot-starter` 与 `protobuf-maven-plugin`，使 Java 端可以自动编译上一阶段编写的 `workspace.proto`。
  3. 创建了基础的领域服务接口 `WorkspaceDaemonClient` 及其 gRPC 实现框架 `GrpcWorkspaceClientImpl`。
- **架构决策关联**:
  - 由于采用了 CQRS 分离架构，Java 端只做鉴权和 AI 编排，不关心容器启动逻辑。所以沙箱服务的实际操作被隔离到 `GrpcWorkspaceClientImpl` 中，通过 gRPC 转发给后续将要开发的 Go 数据面。
- **风险点与后续任务**:
  - 当前由于 Go 数据面尚未跑起来，Java 层的 gRPC 存根代码被注释掉。
  - **后续任务**: 需要通知团队/其他 Agent，在 `backend-control-plane` 目录下运行 `mvn clean compile` 测试 protobuf 桩代码的生成。
