package service

import (
	"archive/tar"
	"bytes"
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
	pb "github.com/hyqxyd/vibe-coding-project/backend-data-plane/api/workspace/v1"
)

type WarmPool struct {
	mu         sync.Mutex
	containers []string // Container IDs
	client     *client.Client
	maxSize    int
}

func newWarmPool(cli *client.Client, maxSize int) *WarmPool {
	p := &WarmPool{
		client:  cli,
		maxSize: maxSize,
	}
	go p.maintain(context.Background())
	return p
}

func (p *WarmPool) maintain(ctx context.Context) {
	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()
	for {
		select {
		case <-ctx.Done():
			return
		case <-ticker.C:
			p.mu.Lock()
			currentSize := len(p.containers)
			p.mu.Unlock()

			if currentSize < p.maxSize {
				id, err := p.createContainer(ctx, "") // Empty name for random
				if err == nil {
					p.mu.Lock()
					p.containers = append(p.containers, id)
					p.mu.Unlock()
					log.Printf("WarmPool: added new container %s (pool size: %d/%d)", id[:12], currentSize+1, p.maxSize)
				} else {
					log.Printf("WarmPool: failed to create container: %v", err)
				}
			}
		}
	}
}

func (p *WarmPool) createContainer(ctx context.Context, name string) (string, error) {
	resp, err := p.client.ContainerCreate(ctx, &container.Config{
		Image:      "python:3.11-slim",
		Cmd:        []string{"tail", "-f", "/dev/null"},
		Tty:        true,
		WorkingDir: "/workspace",
	}, &container.HostConfig{
		AutoRemove: true,
		Resources: container.Resources{
			Memory:   512 * 1024 * 1024,
			NanoCPUs: 1000 * 1000000,
		},
	}, nil, nil, name)

	if err != nil {
		return "", err
	}

	if err := p.client.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		_ = p.client.ContainerRemove(ctx, resp.ID, types.ContainerRemoveOptions{Force: true})
		return "", err
	}
	return resp.ID, nil
}

func (p *WarmPool) GetContainer(ctx context.Context, targetName string) (string, error) {
	p.mu.Lock()
	if len(p.containers) > 0 {
		id := p.containers[len(p.containers)-1]
		p.containers = p.containers[:len(p.containers)-1]
		p.mu.Unlock()

		// Rename it
		err := p.client.ContainerRename(ctx, id, targetName)
		if err != nil {
			log.Printf("WarmPool: failed to rename container %s, destroying it. Err: %v", id[:12], err)
			_ = p.client.ContainerRemove(ctx, id, types.ContainerRemoveOptions{Force: true})
			// Try again recursively
			return p.GetContainer(ctx, targetName)
		}
		log.Printf("WarmPool: allocated container %s and renamed to %s", id[:12], targetName)
		return id, nil
	}
	p.mu.Unlock()

	log.Printf("WarmPool: pool is empty, creating container synchronously for %s", targetName)
	return p.createContainer(ctx, targetName)
}

type WorkspaceService struct {
	pb.UnimplementedWorkspaceServiceServer
	dockerClient *client.Client
	pool         *WarmPool
}

func NewWorkspaceService() (*WorkspaceService, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("failed to create docker client: %w", err)
	}
	pool := newWarmPool(cli, 5) // Maintain 5 containers
	return &WorkspaceService{dockerClient: cli, pool: pool}, nil
}

func (s *WorkspaceService) StartWorkspace(ctx context.Context, req *pb.StartWorkspaceRequest) (*pb.StartWorkspaceResponse, error) {
	log.Printf("Received StartWorkspace request for workspace: %s", req.WorkspaceId)
	containerName := fmt.Sprintf("vibe-ws-%s", req.WorkspaceId)

	// 检查是否已经存在且运行中
	inspect, err := s.dockerClient.ContainerInspect(ctx, containerName)
	if err == nil && inspect.State.Running {
		log.Printf("Workspace container %s already running", containerName)
		return &pb.StartWorkspaceResponse{
			WorkspaceId: req.WorkspaceId,
			ContainerId: inspect.ID,
			PtyWsUrl:    fmt.Sprintf("ws://localhost:8080/pty/%s", req.WorkspaceId),
			Status:      pb.WorkspaceStatus_WORKSPACE_STATUS_RUNNING,
		}, nil
	}

	// 尝试清理残留的停止容器
	if err == nil {
		_ = s.dockerClient.ContainerRemove(ctx, containerName, types.ContainerRemoveOptions{Force: true})
	}

	// 从温启动池获取
	id, err := s.pool.GetContainer(ctx, containerName)
	if err != nil {
		log.Printf("Failed to get container from pool: %v", err)
		return &pb.StartWorkspaceResponse{
			WorkspaceId:  req.WorkspaceId,
			Status:       pb.WorkspaceStatus_WORKSPACE_STATUS_FAILED,
			ErrorMessage: err.Error(),
		}, nil
	}

	log.Printf("Successfully started workspace container from Warm Pool: %s", id)
	return &pb.StartWorkspaceResponse{
		WorkspaceId: req.WorkspaceId,
		ContainerId: id,
		PtyWsUrl:    fmt.Sprintf("ws://localhost:8080/pty/%s", req.WorkspaceId),
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
		log.Printf("Container %s is missing or stopped, auto-recovering from Warm Pool...", containerName)

		// 如果容器因异常停止但还残留在系统中，先强制清理
		if inspectErr == nil {
			_ = s.dockerClient.ContainerRemove(ctx, containerName, types.ContainerRemoveOptions{Force: true})
		}

		// 从温启动池获取新的容器
		id, recoverErr := s.pool.GetContainer(ctx, containerName)
		if recoverErr != nil {
			return nil, fmt.Errorf("failed to auto-recover container from pool: %w", recoverErr)
		}
		log.Printf("Auto-recovery successful for %s (new id: %s)", containerName, id[:12])
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
