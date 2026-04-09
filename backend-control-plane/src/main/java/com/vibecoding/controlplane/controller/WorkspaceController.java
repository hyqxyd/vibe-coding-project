package com.vibecoding.controlplane.controller;

import com.vibecoding.controlplane.service.workspace.CodeExecutionResult;
import com.vibecoding.controlplane.service.workspace.WorkspaceDaemonClient;
import com.vibecoding.controlplane.service.workspace.WorkspaceInfo;
import com.vibecoding.controlplane.service.workspace.ApiKeyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/workspace")
@CrossOrigin(origins = "*") // 允许前端跨域请求
public class WorkspaceController {

    private final WorkspaceDaemonClient workspaceClient;
    private final ApiKeyManager apiKeyManager;

    @Autowired
    public WorkspaceController(WorkspaceDaemonClient workspaceClient, ApiKeyManager apiKeyManager) {
        this.workspaceClient = workspaceClient;
        this.apiKeyManager = apiKeyManager;
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

    @PostMapping("/{workspaceId}/execute")
    public CodeExecutionResult executeCode(
            @PathVariable String workspaceId,
            @RequestBody ExecuteCodePayload payload) {
        
        Map<String, String> files = payload.getFiles();
        if (files == null) {
            files = new HashMap<>();
        }
        
        // Inject API Key from Control Plane (MVP approach)
        String apiKey = apiKeyManager.getActiveApiKey();
        if (apiKey != null && !apiKey.isEmpty()) {
            files.put("src/data/config.json", "{\n  \"KIMI_API_KEY\": \"" + apiKey + "\"\n}");
        }

        return workspaceClient.executeCode(
                workspaceId, 
                files, 
                payload.getCommand(), 
                payload.getTimeoutSeconds() != null ? payload.getTimeoutSeconds() : 30
        );
    }

    public static class ExecuteCodePayload {
        private Map<String, String> files;
        private String command;
        private Integer timeoutSeconds;

        public Map<String, String> getFiles() { return files; }
        public void setFiles(Map<String, String> files) { this.files = files; }

        public String getCommand() { return command; }
        public void setCommand(String command) { this.command = command; }

        public Integer getTimeoutSeconds() { return timeoutSeconds; }
        public void setTimeoutSeconds(Integer timeoutSeconds) { this.timeoutSeconds = timeoutSeconds; }
    }
}
