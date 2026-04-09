package com.vibecoding.controlplane.service.workspace;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ApiKeyManager {

    @Value("${llm.api.key:}")
    private String llmApiKey;

    /**
     * Get the LLM API Key to inject into the workspace execution environment.
     * In the future, this can be extended to fetch from a database pool based on the user/workspace.
     */
    public String getActiveApiKey() {
        return llmApiKey;
    }
}
