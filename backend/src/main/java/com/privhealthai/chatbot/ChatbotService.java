package com.privhealthai.chatbot;

import com.privhealthai.chatbot.dto.ChatRequest;
import com.privhealthai.chatbot.dto.ChatResponse;
import com.privhealthai.chatbot.dto.ChatStructured;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatHistoryRepository chatHistoryRepository;
    private final KeywordResponseEngine keywordEngine;
    private final OpenRouterClient openRouterClient;
    private final ChatStructuredEngine structuredEngine;

    public ChatResponse chat(ChatRequest request, UUID userId) {
        String botResponse;
        ChatStructured structured = null;

        if (openRouterClient.isEnabled()) {
            try {
                List<Map<String, String>> history = loadHistory(userId);
                structured = structuredEngine.analyze(request.getMessage(), history);
                botResponse = structuredEngine.toPlainText(structured);
            } catch (Exception e) {
                log.warn("OpenRouter call failed, falling back to keyword engine: {}", e.getMessage());
                botResponse = keywordEngine.getResponse(request.getMessage());
                structured = null;
            }
        } else {
            botResponse = keywordEngine.getResponse(request.getMessage());
        }

        ChatHistoryEntity entity = ChatHistoryEntity.builder()
                .userId(userId)
                .message(request.getMessage())
                .response(botResponse)
                .build();
        entity = chatHistoryRepository.save(entity);

        return ChatResponse.builder()
                .id(entity.getId())
                .message(entity.getMessage())
                .response(entity.getResponse())
                .createdAt(entity.getCreatedAt())
                .structured(structured)
                .build();
    }

    /**
     * Load this user's recent chat turns in chronological order, flattened into
     * alternating user/model messages for the LLM context window.
     */
    private List<Map<String, String>> loadHistory(UUID userId) {
        List<ChatHistoryEntity> recent =
                chatHistoryRepository.findTop8ByUserIdOrderByCreatedAtDesc(userId);
        Collections.reverse(recent);

        List<Map<String, String>> turns = new ArrayList<>();
        for (ChatHistoryEntity h : recent) {
            turns.add(Map.of("role", "user", "text", h.getMessage()));
            if (h.getResponse() != null && !h.getResponse().isBlank()) {
                turns.add(Map.of("role", "model", "text", h.getResponse()));
            }
        }
        return turns;
    }
}
