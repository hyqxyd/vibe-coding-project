package com.vibecoding.controlplane.service.workspace;

import org.springframework.stereotype.Service;
// import net.devh.boot.grpc.client.inject.GrpcClient;
// import com.vibecoding.workspace.v1.WorkspaceServiceGrpc;
// import com.vibecoding.workspace.v1.WorkspaceProto.*;

import java.util.UUID;

/**
 * WorkspaceDaemonClient 的 gRPC 实现
 *
 * 核心逻辑：
 * - 拦截业务层的调用请求
 * - 组装 StartWorkspaceRequest (protobuf)
 * - 通过 @GrpcClient 调用远程 Go 数据面节点
 * - 将 StartWorkspaceResponse (protobuf) 解析为领域模型 WorkspaceInfo
 */
@Service
public class GrpcWorkspaceClientImpl implements WorkspaceDaemonClient {

    // 预留的 gRPC 客户端注入，需等 mvn compile 生成桩代码后解开注释
    // @GrpcClient("workspace-daemon")
    // private WorkspaceServiceGrpc.WorkspaceServiceBlockingStub workspaceStub;

    @Override
    public WorkspaceInfo startWorkspace(String studentId, String courseId) {
        String workspaceId = UUID.randomV4().toString();
        
        // 模拟 gRPC 调用逻辑 (MVP 阶段)
        /*
        StartWorkspaceRequest request = StartWorkspaceRequest.newBuilder()
                .setWorkspaceId(workspaceId)
                .setStudentId(studentId)
                .setCourseId(courseId)
                .setBaseImage("vibe-python-base:latest")
                .setCpuLimitM(1000)
                .setMemoryLimitMb(512)
                .build();
                
        StartWorkspaceResponse response = workspaceStub.startWorkspace(request);
        
        return new WorkspaceInfo(
                response.getWorkspaceId(),
                response.getContainerId(),
                response.getPtyWsUrl(),
                response.getStatus().name()
        );
        */

        System.out.println("Calling Go Data Plane to start workspace for student: " + studentId);
        return new WorkspaceInfo(
                workspaceId,
                "mock-container-id-001",
                "ws://localhost:8081/pty?token=mock_token",
                "STARTING"
        );
    }

    @Override
    public void stopWorkspace(String workspaceId) {
        // TODO: invoke StopWorkspace RPC
        System.out.println("Stopping workspace: " + workspaceId);
    }

    @Override
    public WorkspaceInfo getStatus(String workspaceId) {
        // TODO: invoke GetWorkspaceStatus RPC
        return new WorkspaceInfo(workspaceId, "mock-container-id", "ws://localhost:8081/pty", "RUNNING");
    }

    @Override
    public void destroyWorkspace(String workspaceId) {
        // TODO: invoke DestroyWorkspace RPC
        System.out.println("Destroying workspace: " + workspaceId);
    }
}
