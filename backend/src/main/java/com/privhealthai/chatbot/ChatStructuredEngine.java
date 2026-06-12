package com.privhealthai.chatbot;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.privhealthai.chatbot.dto.ChatStructured;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Turns a free-text chat message into a structured, card-friendly reply.
 * The LLM classifies each message as a symptom description ("symptom") or a
 * general/info question ("info") and returns strict JSON we render as cards.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ChatStructuredEngine {

    private final OpenRouterClient openRouterClient;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
            You are PrivHealthAI Assistant, a concise, friendly healthcare AI.
            Reply to the user's latest message with ONLY a JSON object — no markdown fences,
            no text before or after — in exactly this shape:

            {
              "type": "symptom" | "info",
              "reply": "string",
              "summary": "string",
              "possibleCauses": ["string"],
              "actions": ["string"],
              "avoid": ["string"],
              "riskLevel": "LOW" | "MEDIUM" | "HIGH" | null,
              "recommendedSpecialist": "string or null",
              "emergencyWarning": ["string"]
            }

            Choose "type":
            - "symptom": the user is describing how they feel or symptoms they have
              (e.g. "burning in my chest after eating", "headache and fever for 2 days").
              Fill the structured fields and set "reply" to "".
            - "info": greetings, thanks, medication questions, definitions, or any other
              non-symptom question. Put a concise, scannable answer in "reply" (you may use
              "• " bullet lines and **bold**). Set summary to "", all arrays to [],
              riskLevel to null, recommendedSpecialist to null.

            For "symptom" type:
            - summary: 1-2 plain-language sentences naming the most likely explanation.
            - possibleCauses: 3-5 short items (a few words each).
            - actions: 3-6 short, safe self-care steps.
            - avoid: foods or things to avoid if relevant, otherwise [].
            - riskLevel: LOW (self-care is fine), MEDIUM (see a doctor soon),
              HIGH (needs urgent / same-day care).
            - recommendedSpecialist: the single most relevant specialist
              (e.g. "Gastroenterologist", "Cardiologist", "General Physician").
            - emergencyWarning: red-flag symptoms that mean call 112 now — ONLY when the
              condition can become serious; otherwise [].

            Rules:
            - Be brief. Each list item is a few words, never a paragraph.
            - These are possibilities, not a diagnosis. Never give prescription dosages.
            - If the message clearly describes a life-threatening situation (severe chest pain,
              trouble breathing, stroke signs, heavy bleeding), set riskLevel HIGH, fill
              emergencyWarning, and in summary tell them to call 112 immediately.
            - Keep the whole reply under 200 words.
            """;

    /**
     * @param history prior turns as maps of {"role": user|model, "text": ...}
     * @throws RuntimeException if the LLM call or JSON parsing fails (caller falls back)
     */
    public ChatStructured analyze(String userMessage, List<Map<String, String>> history) {
        String raw = openRouterClient.completeWithSystem(SYSTEM_PROMPT, history, userMessage, 0.4);
        return parse(raw);
    }

    private ChatStructured parse(String raw) {
        String json = stripFences(raw);
        try {
            JsonNode n = objectMapper.readTree(json);
            String type = n.path("type").asText("info");
            String riskLevel = n.hasNonNull("riskLevel") ? n.path("riskLevel").asText() : null;
            String specialist = n.hasNonNull("recommendedSpecialist")
                    ? n.path("recommendedSpecialist").asText() : null;

            return new ChatStructured(
                    type.isBlank() ? "info" : type,
                    n.path("reply").asText(""),
                    n.path("summary").asText(""),
                    toList(n.path("possibleCauses")),
                    toList(n.path("actions")),
                    toList(n.path("avoid")),
                    blankToNull(riskLevel),
                    blankToNull(specialist),
                    toList(n.path("emergencyWarning"))
            );
        } catch (Exception e) {
            throw new IllegalStateException("Could not parse chat JSON: " + e.getMessage(), e);
        }
    }

    private List<String> toList(JsonNode arr) {
        List<String> out = new ArrayList<>();
        if (arr != null && arr.isArray()) {
            for (JsonNode item : arr) {
                String v = item.asText("").trim();
                if (!v.isEmpty()) out.add(v);
            }
        }
        return out;
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank() || "null".equalsIgnoreCase(s)) ? null : s;
    }

    /** Models sometimes wrap JSON in ```json fences or add a preamble — extract the object. */
    private String stripFences(String raw) {
        String s = raw.trim();
        int start = s.indexOf('{');
        int end = s.lastIndexOf('}');
        if (start >= 0 && end > start) {
            return s.substring(start, end + 1);
        }
        return s;
    }

    /** Flatten a structured reply into readable text for DB storage and history context. */
    public String toPlainText(ChatStructured s) {
        if ("info".equals(s.type())) {
            return s.reply() != null ? s.reply() : "";
        }
        StringBuilder sb = new StringBuilder();
        if (s.summary() != null && !s.summary().isBlank()) sb.append(s.summary());
        appendList(sb, "Possible causes", s.possibleCauses());
        appendList(sb, "What you can do", s.actions());
        appendList(sb, "Avoid", s.avoid());
        if (s.riskLevel() != null) sb.append("\nRisk level: ").append(s.riskLevel());
        if (s.recommendedSpecialist() != null) sb.append("\nRecommended specialist: ").append(s.recommendedSpecialist());
        appendList(sb, "Seek emergency care if", s.emergencyWarning());
        return sb.toString().trim();
    }

    private void appendList(StringBuilder sb, String label, List<String> items) {
        if (items != null && !items.isEmpty()) {
            sb.append("\n").append(label).append(": ").append(String.join(", ", items));
        }
    }
}
