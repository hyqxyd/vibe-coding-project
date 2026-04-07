package com.vibecoding.controlplane.service.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

/**
 * AI Reviewer 角色服务
 * 职责：负责审查代码规范、校验接口契约，并决定是否允许合并。
 */
@Service
public class AiReviewerService {

    private final ChatClient reviewerClient;

    public AiReviewerService(ChatClient chatClient) {
        // 利用 Spring AI 的 clone 特性，派生出专门的 Reviewer 角色
        this.reviewerClient = chatClient.mutate()
                .defaultSystem("""
                        你现在是 Vibe Coding 平台的 'AI Reviewer' (代码审查者)。
                        你的职责是：
                        1. 严格检查传入的代码是否符合 Go/Java 企业级代码规范。
                        2. 检查是否有未处理的错误 (Error) 或空指针异常风险。
                        3. 如果代码不符合要求，请明确指出错误位置和修复建议。
                        4. 你的最终结论只能是 "APPROVE" 或 "REJECT"。
                        """)
                .build();
    }

    /**
     * 审查代码并返回意见
     *
     * @param codeSnippet 待审查的代码片段
     * @return 审查意见，必须以 APPROVE 或 REJECT 结尾
     */
    public String reviewCode(String codeSnippet) {
        return this.reviewerClient.prompt()
                .user("请审查以下代码片段：\n\n```\n" + codeSnippet + "\n```")
                .call()
                .content();
    }
}
