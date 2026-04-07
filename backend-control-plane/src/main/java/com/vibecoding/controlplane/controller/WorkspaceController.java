package com.vibecoding.controlplane.controller;

import com.vibecoding.controlplane.service.workspace.WorkspaceDaemonClient;
import com.vibecoding.controlplane.service.workspace.WorkspaceInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/workspace")
public class WorkspaceController {

    private final WorkspaceDaemonClient workspaceClient;

    @Autowired
    public WorkspaceController(WorkspaceDaemonClient workspaceClient) {
        this.workspaceClient = workspaceClient;
    }

    @PostMapping("/start")
    public WorkspaceInfo startWorkspace(@RequestParam String studentId, @RequestParam String courseId) {
        return workspaceClient.startWorkspace(studentId, courseId);
    }

    @GetMapping("/{workspaceId}/status")
    public WorkspaceInfo getStatus(@PathVariable String workspaceId) {
        return workspaceClient.getStatus(workspaceId);
    }

    @PostMapping("/{workspaceId}/stop")
    public String stopWorkspace(@PathVariable String workspaceId) {
        workspaceClient.stopWorkspace(workspaceId);
        return "Workspace stopped";
    }

    @DeleteMapping("/{workspaceId}")
    public String destroyWorkspace(@PathVariable String workspaceId) {
        workspaceClient.destroyWorkspace(workspaceId);
        return "Workspace destroyed";
    }
}
