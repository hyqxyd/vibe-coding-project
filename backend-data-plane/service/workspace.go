package service

import (
	"archive/tar"
	"bytes"
	"context"
	"fmt"
	"log"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
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
		imageName = "alpine:latest"
	}

	resp, err := s.dockerClient.ContainerCreate(ctx, &container.Config{
		Image:      imageName,
		Cmd:        []string{"tail", "-f", "/dev/null"},
		Tty:        true,
		WorkingDir: "/workspace",
	}, &container.HostConfig{
		AutoRemove: true, // 容器停止时自动清理
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

func (s *WorkspaceService) ExecuteCode(ctx context.Context, req *pb.ExecuteCodeRequest) (*pb.ExecuteCodeResponse, error) {
	log.Printf("Received ExecuteCode request for workspace: %s", req.WorkspaceId)
	containerName := fmt.Sprintf("vibe-ws-%s", req.WorkspaceId)

	// 0. 核心兜底策略 (Auto-Recovery): 如果容器被 AutoRemove 或因 OOM 崩溃，我们在这里拦截并原地重生
	inspect, inspectErr := s.dockerClient.ContainerInspect(ctx, containerName)
	if inspectErr != nil || !inspect.State.Running {
		log.Printf("Container %s is missing or stopped, auto-recovering...", containerName)

		// 如果容器因异常停止但还残留在系统中，先强制清理
		if inspectErr == nil {
			_ = s.dockerClient.ContainerRemove(ctx, containerName, types.ContainerRemoveOptions{Force: true})
		}

		// 重新创建并启动一个全新的干净沙箱
		resp, createErr := s.dockerClient.ContainerCreate(ctx, &container.Config{
			Image:      "alpine:latest",
			Cmd:        []string{"tail", "-f", "/dev/null"},
			Tty:        true,
			WorkingDir: "/workspace",
		}, &container.HostConfig{
			AutoRemove: true,
			Resources: container.Resources{
				Memory:   512 * 1024 * 1024,
				NanoCPUs: 1000 * 1000000,
			},
		}, nil, nil, containerName)

		if createErr != nil {
			return nil, fmt.Errorf("failed to auto-recover container: %w", createErr)
		}

		if startErr := s.dockerClient.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); startErr != nil {
			return nil, fmt.Errorf("failed to start recovered container: %w", startErr)
		}
		log.Printf("Auto-recovery successful for %s", containerName)
	}

	// 1. Create a tar archive containing the files
	var tarBuffer bytes.Buffer
	tarWriter := tar.NewWriter(&tarBuffer)

	for filename, content := range req.Files {
		contentBytes := []byte(content)
		header := &tar.Header{
			Name: filename,
			Mode: 0644,
			Size: int64(len(contentBytes)),
		}
		if err := tarWriter.WriteHeader(header); err != nil {
			return nil, fmt.Errorf("failed to write tar header for file %s: %w", filename, err)
		}
		if _, err := tarWriter.Write(contentBytes); err != nil {
			return nil, fmt.Errorf("failed to write tar content for file %s: %w", filename, err)
		}
	}
	if err := tarWriter.Close(); err != nil {
		return nil, fmt.Errorf("failed to close tar writer: %w", err)
	}

	// 2. Copy the tar archive into the container's /workspace directory
	err := s.dockerClient.CopyToContainer(ctx, containerName, "/workspace", &tarBuffer, types.CopyToContainerOptions{})
	if err != nil {
		// If /workspace doesn't exist, we might need to create it first, but usually Docker handles it or we can set WorkDir in container creation
		// Let's create the container with WorkDir: "/workspace" next time. For now, let's copy to "/" if it fails
		err = s.dockerClient.CopyToContainer(ctx, containerName, "/", &tarBuffer, types.CopyToContainerOptions{})
		if err != nil {
			return nil, fmt.Errorf("failed to copy files to container: %w", err)
		}
	}

	// 3. Create an exec instance to run the command
	execConfig := types.ExecConfig{
		Cmd:          []string{"sh", "-c", req.Command},
		AttachStdout: true,
		AttachStderr: true,
		WorkingDir:   "/workspace",
	}

	// If the previous copy to /workspace failed and we copied to /, the working dir should probably be /
	// To be safe, we'll execute it in the root or /workspace
	execCreateResp, err := s.dockerClient.ContainerExecCreate(ctx, containerName, execConfig)
	if err != nil {
		// Fallback to / if /workspace doesn't exist
		execConfig.WorkingDir = "/"
		execCreateResp, err = s.dockerClient.ContainerExecCreate(ctx, containerName, execConfig)
		if err != nil {
			return nil, fmt.Errorf("failed to create exec instance: %w", err)
		}
	}

	// 4. Attach to the exec instance to read output
	execAttachResp, err := s.dockerClient.ContainerExecAttach(ctx, execCreateResp.ID, types.ExecStartCheck{})
	if err != nil {
		return nil, fmt.Errorf("failed to attach to exec instance: %w", err)
	}
	defer execAttachResp.Close()

	// Handle timeout if specified
	var execCtx context.Context
	var cancel context.CancelFunc
	if req.TimeoutSeconds > 0 {
		execCtx, cancel = context.WithTimeout(ctx, time.Duration(req.TimeoutSeconds)*time.Second)
		defer cancel()
	} else {
		execCtx = ctx
	}

	var stdoutBuf, stderrBuf bytes.Buffer
	outputDone := make(chan error, 1)

	go func() {
		// Docker multiplexes stdout and stderr, stdcopy.StdCopy demultiplexes them
		_, err := stdcopy.StdCopy(&stdoutBuf, &stderrBuf, execAttachResp.Reader)
		outputDone <- err
	}()

	// Wait for execution to finish or timeout
	select {
	case <-execCtx.Done():
		return &pb.ExecuteCodeResponse{
			ErrorMessage: fmt.Sprintf("Execution timed out after %d seconds", req.TimeoutSeconds),
			ExitCode:     -1,
		}, nil
	case err := <-outputDone:
		if err != nil {
			log.Printf("Error reading exec output: %v", err)
		}
	}

	// 5. Inspect exec instance to get exit code
	execInspect, err := s.dockerClient.ContainerExecInspect(ctx, execCreateResp.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to inspect exec instance: %w", err)
	}

	return &pb.ExecuteCodeResponse{
		Stdout:   stdoutBuf.String(),
		Stderr:   stderrBuf.String(),
		ExitCode: int32(execInspect.ExitCode),
	}, nil
}
