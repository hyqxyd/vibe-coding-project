package com.vibecoding.controlplane.service.workspace;

public class WorkspaceInfo {
    private String workspaceId;
    private String containerId;
    private String ptyWsUrl;
    private String status;

    public WorkspaceInfo(String workspaceId, String containerId, String ptyWsUrl, String status) {
        this.workspaceId = workspaceId;
        this.containerId = containerId;
        this.ptyWsUrl = ptyWsUrl;
        this.status = status;
    }

    public String getWorkspaceId() { return workspaceId; }
    public String getContainerId() { return containerId; }
    public String getPtyWsUrl() { return ptyWsUrl; }
    public String getStatus() { return status; }
}
