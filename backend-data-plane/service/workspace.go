package service

import (
	"context"
	"fmt"
	"log"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	pb "github.com/hyqxyd/vibe-coding-project/backend-data-plane/api/workspace/v1"
)

type WorkspaceService struct {
	pb.UnimplementedWorkspaceServiceServer
	dockerClient *client.Client
}

func NewWorkspaceService() (*WorkspaceService, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}
	return &WorkspaceService{dockerClient: cli}, nil
}

func (s *WorkspaceService) StartWorkspace(ctx context.Context, req *pb.StartWorkspaceRequest) (*pb.StartWorkspaceResponse, error) {
	log.Printf("Received StartWorkspace request for workspace: %s", req.WorkspaceId)

	// Note: In a real system, you'd pull the image first if it doesn't exist.
	// We'll assume the image exists or just use a basic one for now.
	imageName := req.BaseImage
	if imageName == "" {
		imageName = "ubuntu:latest"
	}

	resp, err := s.dockerClient.ContainerCreate(ctx, &container.Config{
		Image: imageName,
		Cmd:   []string{"sleep", "infinity"},
		Tty:   true,
	}, &container.HostConfig{
		Resources: container.Resources{
			Memory:   int64(req.MemoryLimitMb) * 1024 * 1024,
			NanoCPUs: int64(req.CpuLimitM) * 1000000,
		},
	}, nil, nil, fmt.Sprintf("vibe-ws-%s", req.WorkspaceId))

	if err != nil {
		log.Printf("Failed to create container: %v", err)
		return &pb.StartWorkspaceResponse{
			WorkspaceId:  req.WorkspaceId,
			Status:       pb.WorkspaceStatus_WORKSPACE_STATUS_FAILED,
			ErrorMessage: err.Error(),
		}, nil
	}

	if err := s.dockerClient.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		log.Printf("Failed to start container: %v", err)
		return &pb.StartWorkspaceResponse{
			WorkspaceId:  req.WorkspaceId,
			Status:       pb.WorkspaceStatus_WORKSPACE_STATUS_FAILED,
			ErrorMessage: err.Error(),
		}, nil
	}

	log.Printf("Successfully started workspace container: %s", resp.ID)
	return &pb.StartWorkspaceResponse{
		WorkspaceId: req.WorkspaceId,
		ContainerId: resp.ID,
		PtyWsUrl:    fmt.Sprintf("ws://localhost:8080/pty/%s", req.WorkspaceId), // Mock PTY URL
		Status:      pb.WorkspaceStatus_WORKSPACE_STATUS_RUNNING,
	}, nil
}

func (s *WorkspaceService) StopWorkspace(ctx context.Context, req *pb.StopWorkspaceRequest) (*pb.StopWorkspaceResponse, error) {
	log.Printf("Received StopWorkspace request for workspace: %s", req.WorkspaceId)
	containerName := fmt.Sprintf("vibe-ws-%s", req.WorkspaceId)
	
	err := s.dockerClient.ContainerStop(ctx, containerName, container.StopOptions{})
	if err != nil {
		return &pb.StopWorkspaceResponse{Success: false, ErrorMessage: err.Error()}, nil
	}

	return &pb.StopWorkspaceResponse{Success: true}, nil
}

func (s *WorkspaceService) GetWorkspaceStatus(ctx context.Context, req *pb.GetWorkspaceStatusRequest) (*pb.GetWorkspaceStatusResponse, error) {
	log.Printf("Received GetWorkspaceStatus request for workspace: %s", req.WorkspaceId)
	containerName := fmt.Sprintf("vibe-ws-%s", req.WorkspaceId)
	
	inspect, err := s.dockerClient.ContainerInspect(ctx, containerName)
	if err != nil {
		return nil, fmt.Errorf("failed to inspect container: %w", err)
	}

	status := pb.WorkspaceStatus_WORKSPACE_STATUS_UNSPECIFIED
	if inspect.State.Running {
		status = pb.WorkspaceStatus_WORKSPACE_STATUS_RUNNING
	} else if inspect.State.Status == "exited" {
		status = pb.WorkspaceStatus_WORKSPACE_STATUS_STOPPED
	}

	return &pb.GetWorkspaceStatusResponse{
		WorkspaceId: req.WorkspaceId,
		Status:      status,
		PtyWsUrl:    fmt.Sprintf("ws://localhost:8080/pty/%s", req.WorkspaceId),
	}, nil
}

func (s *WorkspaceService) DestroyWorkspace(ctx context.Context, req *pb.DestroyWorkspaceRequest) (*pb.DestroyWorkspaceResponse, error) {
	log.Printf("Received DestroyWorkspace request for workspace: %s", req.WorkspaceId)
	containerName := fmt.Sprintf("vibe-ws-%s", req.WorkspaceId)
	
	err := s.dockerClient.ContainerRemove(ctx, containerName, types.ContainerRemoveOptions{Force: true})
	if err != nil {
		return &pb.DestroyWorkspaceResponse{Success: false, ErrorMessage: err.Error()}, nil
	}

	return &pb.DestroyWorkspaceResponse{Success: true}, nil
}
