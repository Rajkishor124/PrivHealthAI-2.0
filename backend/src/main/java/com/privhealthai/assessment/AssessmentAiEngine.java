package com.privhealthai.assessment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.privhealthai.assessment.dto.ConditionDto;
import com.privhealthai.assessment.dto.MedicineDto;
import com.privhealthai.chatbot.OpenRouterClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Uses the LLM to turn the user's symptoms into a possible-conditions list,
 * over-the-counter medicine suggestions, and a recommended doctor specialization.
 * The specialization is constrained to the ones that exist in our doctors table.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AssessmentAiEngine {

    private final OpenRouterClient openRouterClient;
    private final ObjectMapper objectMapper;

    public record AiAnalysis(
            List<ConditionDto> possibleConditions,
            List<MedicineDto> medicines,
            String recommendedSpecialization,
            String advice) {}

    private static final String SYSTEM_PROMPT = """
            You are a clinical triage assistant for the PrivHealthAI platform. Given a patient's
            symptoms, age and gender, you analyze them and reply with ONLY a JSON object — no
            markdown fences, no commentary — in exactly this shape:

            {
              "possibleConditions": [
                {"name": "Condition name", "likelihood": "High|Moderate|Low", "description": "1-2 plain-language sentences on why it matches the symptoms"}
              ],
              "medicines": [
                {"name": "Generic medicine name", "purpose": "What it helps with here", "note": "Short safety note, e.g. typical adult OTC guidance or when to avoid"}
              ],
              "recommendedSpecialization": "one of: Cardiology, Neurology, Dermatology, Orthopedics, General Medicine",
              "advice": "2-4 sentences of practical self-care and when to see a doctor"
            }

            Rules:
            - List 2-4 possibleConditions ordered from most to least likely. These are POSSIBILITIES,
              not diagnoses.
            - Suggest only common over-the-counter medicines (e.g. paracetamol, ORS, antacids,
              antihistamines). Never suggest prescription-only drugs, antibiotics, or individual
              dosages beyond standard label guidance.
            - recommendedSpecialization MUST be exactly one of the five listed values; pick
              General Medicine when unsure.
            - If symptoms suggest an emergency (e.g. chest pain with breathlessness), say so in
              "advice" and tell the patient to call 112 — still fill in the other fields.
            """;

    public AiAnalysis analyze(List<String> symptoms, String additionalSymptoms, int age, String gender,
                              String riskLevel) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Patient profile:\n");
        prompt.append("- Age: ").append(age).append("\n");
        prompt.append("- Gender: ").append(gender).append("\n");
        prompt.append("- Selected symptoms: ").append(String.join(", ", symptoms)).append("\n");
        if (additionalSymptoms != null && !additionalSymptoms.isBlank()) {
            prompt.append("- Described in their own words: ").append(additionalSymptoms.trim()).append("\n");
        }
        prompt.append("- Rule-engine risk level: ").append(riskLevel).append("\n");
        prompt.append("\nReturn the JSON analysis.");

        String raw = openRouterClient.completeWithSystem(SYSTEM_PROMPT, prompt.toString(), 0.3);
        return parse(raw);
    }

    private AiAnalysis parse(String raw) {
        String json = stripFences(raw);
        try {
            JsonNode root = objectMapper.readTree(json);

            List<ConditionDto> conditions = new ArrayList<>();
            for (JsonNode c : root.path("possibleConditions")) {
                conditions.add(new ConditionDto(
                        c.path("name").asText(""),
                        c.path("likelihood").asText(""),
                        c.path("description").asText("")));
            }

            List<MedicineDto> medicines = new ArrayList<>();
            for (JsonNode m : root.path("medicines")) {
                medicines.add(new MedicineDto(
                        m.path("name").asText(""),
                        m.path("purpose").asText(""),
                        m.path("note").asText("")));
            }

            String specialization = root.path("recommendedSpecialization").asText("General Medicine");
            String advice = root.path("advice").asText("");

            if (conditions.isEmpty()) {
                throw new IllegalStateException("AI analysis returned no conditions");
            }
            return new AiAnalysis(conditions, medicines, specialization, advice);
        } catch (Exception e) {
            throw new IllegalStateException("Could not parse AI analysis: " + e.getMessage(), e);
        }
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
}
