package com.vibecoding.controlplane.service.ai;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.ChatClient.Builder;
import org.springframework.ai.chat.client.ChatClient.CallResponseSpec;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiReviewerServiceTest {

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ChatClient chatClientMock;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ChatClient mutatedClientMock;

    private AiReviewerService aiReviewerService;

    @BeforeEach
    void setUp() {
        // Mock 链式调用：chatClient.mutate().defaultSystem(...).build() -> mutatedClientMock
        when(chatClientMock.mutate().defaultSystem(anyString()).build())
                .thenReturn(mutatedClientMock);
        
        aiReviewerService = new AiReviewerService(chatClientMock);
    }

    @Test
    void shouldReturnApproveForGoodCode() {
        // Arrange
        String goodCode = "public void doSomething() { System.out.println(\"Hello\"); }";
        when(mutatedClientMock.prompt().user(anyString()).call().content())
                .thenReturn("代码逻辑清晰，符合规范。APPROVE");

        // Act
        String result = aiReviewerService.reviewCode(goodCode);

        // Assert
        assertThat(result).contains("APPROVE");
    }

    @Test
    void shouldReturnRejectForBadCode() {
        // Arrange
        String badCode = "func do() { panic(\"boom\") }";
        when(mutatedClientMock.prompt().user(anyString()).call().content())
                .thenReturn("检测到未捕获的 panic，违反了 Go 并发安全规范。REJECT");

        // Act
        String result = aiReviewerService.reviewCode(badCode);

        // Assert
        assertThat(result).contains("REJECT");
    }
}
