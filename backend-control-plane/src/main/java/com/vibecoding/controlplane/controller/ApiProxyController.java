package com.vibecoding.controlplane.controller;

import com.vibecoding.controlplane.service.workspace.ApiKeyManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/gateway")
@CrossOrigin(origins = "*")
public class ApiProxyController {

    private final ApiKeyManager apiKeyManager;
    private final RestTemplate restTemplate;

    @Autowired
    public ApiProxyController(ApiKeyManager apiKeyManager) {
        this.apiKeyManager = apiKeyManager;
        this.restTemplate = new RestTemplate();
    }

    @PostMapping("/chat/completions")
    public ResponseEntity<String> proxyChatCompletions(@RequestBody Map<String, Object> payload) {
        String apiKey = apiKeyManager.getActiveApiKey();
        if (apiKey == null || apiKey.isEmpty()) {
            return ResponseEntity.status(500).body("{\"error\": \"API Key not configured in Control Plane\"}");
        }

        // We are using DashScope / Kimi compatible endpoint
        String targetUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("Authorization", "Bearer " + apiKey);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    targetUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );
            return response;
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
