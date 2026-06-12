package com.privhealthai.chatbot;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Client for the OpenRouter chat-completions API (OpenAI-compatible).
 * Sends a "models" array so OpenRouter automatically falls back to the next
 * free model when the primary one is rate-limited upstream.
 */
@Slf4j
@Component
public class OpenRouterClient {

    @Value("${openrouter.api-key:}")
    private String apiKey;

    @Value("${openrouter.model:openai/gpt-oss-120b:free}")
    private String model;

    @Value("#{'${openrouter.fallback-models:meta-llama/llama-3.3-70b-instruct:free,qwen/qwen3-next-80b-a3b-instruct:free}'.split(',')}")
    private List<String> fallbackModels;

    /** OpenRouter rejects requests whose "models" array has more than 3 entries. */
    private static final int MAX_MODEL_CHAIN = 3;

    @Value("${openrouter.base-url:https://openrouter.ai/api/v1}")
    private String baseUrl;

    private static final String CHAT_SYSTEM_PROMPT = """
            You are PrivHealthAI Assistant, a warm, knowledgeable healthcare AI for the PrivHealthAI platform.

            Your role:
            - Answer ANY health-related question clearly and conversationally: symptoms, conditions,
              medications and what they are used for, diet, fitness, mental health,
              first aid, prevention, lab tests, and general wellbeing.
            - You may also answer general everyday questions helpfully, but gently steer toward health topics.
            - Explain medical terms in plain language. Use short paragraphs or bullet points when it helps.

            Important safety rules:
            - Always include a brief reminder that you are an AI and not a substitute for a licensed doctor
              when giving medical advice, diagnosis, or medication guidance.
            - For anything urgent or life-threatening (chest pain, trouble breathing, stroke signs,
              severe bleeding, suicidal thoughts), tell the user to call emergency services (112 in India)
              immediately.
            - Never invent specific prescription dosages for an individual; advise confirming with a
              doctor or pharmacist.
            - You can mention that users can find verified doctors and run a Symptom Assessment inside the
              PrivHealthAI app when relevant.

            Keep responses concise, friendly, and easy to read.
            """;

    private final RestClient restClient = RestClient.builder()
            .requestFactory(clientHttpRequestFactory())
            .build();

    private static org.springframework.http.client.ClientHttpRequestFactory clientHttpRequestFactory() {
        var factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout((int) Duration.ofSeconds(10).toMillis());
        factory.setReadTimeout((int) Duration.ofSeconds(60).toMillis());
        return factory;
    }

    public boolean isEnabled() {
        return apiKey != null && !apiKey.isBlank() && !apiKey.equals("replace-later");
    }

    /**
     * Conversational reply for the chatbot. History maps use "role" (user|model)
     * and "text"; the model role is translated to "assistant".
     */
    public String generate(String userMessage, List<Map<String, String>> history) {
        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", CHAT_SYSTEM_PROMPT));

        for (Map<String, String> turn : history) {
            String role = "model".equals(turn.get("role")) ? "assistant" : turn.get("role");
            messages.add(Map.of("role", role, "content", turn.get("text")));
        }
        messages.add(Map.of("role", "user", "content", userMessage));

        return complete(messages, 0.7);
    }

    /**
     * Single-shot completion with a caller-supplied system prompt — used by the
     * AI assessment engine, which expects a strict JSON reply.
     */
    public String completeWithSystem(String systemPrompt, String userPrompt, double temperature) {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
        );
        return complete(messages, temperature);
    }

    /**
     * Completion with a caller-supplied system prompt plus prior conversation history
     * (each map has "role" = user|model and "text"). Used by the structured chatbot
     * engine so multi-turn context is preserved while still returning strict JSON.
     */
    public String completeWithSystem(String systemPrompt, List<Map<String, String>> history,
                                     String userMessage, double temperature) {
        List<Map<String, Object>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        for (Map<String, String> turn : history) {
            String role = "model".equals(turn.get("role")) ? "assistant" : turn.get("role");
            messages.add(Map.of("role", role, "content", turn.get("text")));
        }
        messages.add(Map.of("role", "user", "content", userMessage));
        return complete(messages, temperature);
    }

    private String complete(List<Map<String, Object>> messages, double temperature) {
        List<String> modelChain = new ArrayList<>();
        modelChain.add(model);
        for (String fb : fallbackModels) {
            String trimmed = fb.trim();
            if (modelChain.size() >= MAX_MODEL_CHAIN) break;
            if (!trimmed.isEmpty() && !modelChain.contains(trimmed)) {
                modelChain.add(trimmed);
            }
        }

        Map<String, Object> body = Map.of(
                "model", model,
                "models", modelChain,
                "messages", messages,
                "temperature", temperature,
                "max_tokens", 1500
        );

        JsonNode response = restClient.post()
                .uri(baseUrl + "/chat/completions")
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apiKey)
                .header("HTTP-Referer", "https://privhealthai.com")
                .header("X-Title", "PrivHealthAI")
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        return extractText(response);
    }

    private String extractText(JsonNode response) {
        if (response == null) {
            throw new IllegalStateException("Empty OpenRouter response");
        }
        if (response.has("error")) {
            throw new IllegalStateException("OpenRouter error: " + response.path("error").path("message").asText());
        }
        JsonNode choices = response.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            throw new IllegalStateException("OpenRouter returned no choices: " + response);
        }
        String text = choices.get(0).path("message").path("content").asText("").trim();
        if (text.isEmpty()) {
            throw new IllegalStateException("OpenRouter returned empty text");
        }
        return text;
    }
}
