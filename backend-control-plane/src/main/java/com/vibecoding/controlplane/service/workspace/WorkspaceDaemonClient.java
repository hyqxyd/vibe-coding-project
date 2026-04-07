package com.vibecoding.controlplane.service.workspace;

/**
 * Workspace 沙箱管理接口
 * 负责通过 gRPC 向数据面（Go Daemon）发送沙箱生命周期控制指令
 */
public interface WorkspaceDaemonClient {

    /**
     * 启动或恢复一个沙箱工作空间
     *
     * @param studentId 对应的学生 ID
     * @param courseId 课程 ID
     * @return 返回 WebSocket PTY 连接地址等信息
     */
    WorkspaceInfo startWorkspace(String studentId, String courseId);

    /**
     * 停止/暂停指定的沙箱
     *
     * @param workspaceId 沙箱全局唯一标识
     */
    void stopWorkspace(String workspaceId);

    /**
     * 查询沙箱健康状态与连接信息
     */
    WorkspaceInfo getStatus(String workspaceId);

    /**
     * 销毁沙箱并清理资源
     */
    void destroyWorkspace(String workspaceId);
}
