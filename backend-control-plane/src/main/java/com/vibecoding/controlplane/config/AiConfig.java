package com.vibecoding.controlplane.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiConfig {

    /**
     * 配置基础的 ChatClient，后续可以在服务中根据不同角色 (Builder/Reviewer) 进行 clone 并附加特定的 System Prompt
     */
    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
                .defaultSystem("你是一个 Vibe Coding 平台中的基础 AI 引擎，请遵循团队的开发规范执行操作。")
                .build();
    }
}
