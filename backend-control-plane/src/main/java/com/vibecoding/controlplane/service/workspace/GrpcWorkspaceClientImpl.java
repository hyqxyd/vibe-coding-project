package com.vibecoding.controlplane.service.workspace;

import org.springframework.stereotype.Service;
import net.devh.boot.grpc.client.inject.GrpcClient;
import com.vibecoding.workspace.v1.WorkspaceServiceGrpc;
import com.vibecoding.workspace.v1.StartWorkspaceRequest;
import com.vibecoding.workspace.v1.StartWorkspaceResponse;
import com.vibecoding.workspace.v1.StopWorkspaceRequest;
import com.vibecoding.workspace.v1.StopWorkspaceResponse;
import com.vibecoding.workspace.v1.GetWorkspaceStatusRequest;
import com.vibecoding.workspace.v1.GetWorkspaceStatusResponse;
import com.vibecoding.workspace.v1.DestroyWorkspaceRequest;
import com.vibecoding.workspace.v1.DestroyWorkspaceResponse;

import java.util.UUID;

/**
 * WorkspaceDaemonClient 的 gRPC 实现
 */
@Service
public class GrpcWorkspaceClientImpl implements WorkspaceDaemonClient {

    @GrpcClient("workspace-daemon")
    private WorkspaceServiceGrpc.WorkspaceServiceBlockingStub workspaceStub;

    @Override
    public WorkspaceInfo startWorkspace(String studentId, String courseId) {
        String workspaceId = UUID.randomUUID().toString();
        
        System.out.println("Calling Go Data Plane via gRPC to start workspace for student: " + studentId);
        
        StartWorkspaceRequest request = StartWorkspaceRequest.newBuilder()
                .setWorkspaceId(workspaceId)
                .setStudentId(studentId)
                .setCourseId(courseId)
                .setBaseImage("ubuntu:latest")
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
    }

    @Override
    public void stopWorkspace(String workspaceId) {
        System.out.println("Calling Go Data Plane via gRPC to stop workspace: " + workspaceId);
        StopWorkspaceRequest request = StopWorkspaceRequest.newBuilder()
                .setWorkspaceId(workspaceId)
                .build();
        workspaceStub.stopWorkspace(request);
    }

    @Override
    public WorkspaceInfo getStatus(String workspaceId) {
        System.out.println("Calling Go Data Plane via gRPC to get status for workspace: " + workspaceId);
        GetWorkspaceStatusRequest request = GetWorkspaceStatusRequest.newBuilder()
                .setWorkspaceId(workspaceId)
                .build();
        GetWorkspaceStatusResponse response = workspaceStub.getWorkspaceStatus(request);
        
        return new WorkspaceInfo(
                response.getWorkspaceId(),
                "unknown", // Container ID is not returned in GetStatus currently
                response.getPtyWsUrl(),
                response.getStatus().name()
        );
    }

    @Override
    public void destroyWorkspace(String workspaceId) {
        System.out.println("Calling Go Data Plane via gRPC to destroy workspace: " + workspaceId);
        DestroyWorkspaceRequest request = DestroyWorkspaceRequest.newBuilder()
                .setWorkspaceId(workspaceId)
                .build();
        workspaceStub.destroyWorkspace(request);
    }
}