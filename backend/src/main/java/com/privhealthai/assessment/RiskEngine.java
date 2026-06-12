package com.privhealthai.assessment;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Component
public class RiskEngine {

    private static final Map<String, Integer> SYMPTOM_WEIGHTS = new LinkedHashMap<>();

    static {
        SYMPTOM_WEIGHTS.put("chest_pain", 30);
        SYMPTOM_WEIGHTS.put("shortness_of_breath", 20);
        SYMPTOM_WEIGHTS.put("severe_headache", 20);
        SYMPTOM_WEIGHTS.put("high_fever", 15);
        SYMPTOM_WEIGHTS.put("dizziness", 10);
        SYMPTOM_WEIGHTS.put("vomiting", 10);
        SYMPTOM_WEIGHTS.put("abdominal_pain", 10);
        SYMPTOM_WEIGHTS.put("fatigue", 5);
        SYMPTOM_WEIGHTS.put("mild_headache", 5);
        SYMPTOM_WEIGHTS.put("cough", 5);
        SYMPTOM_WEIGHTS.put("runny_nose", 3);
        SYMPTOM_WEIGHTS.put("sore_throat", 3);
    }

    public record RiskResult(String riskLevel, BigDecimal riskScore, String recommendation) {}

    public RiskResult evaluate(List<String> symptoms, int age, String gender) {
        Set<String> symptomSet = new HashSet<>(symptoms);

        double score = symptoms.stream()
                .mapToInt(s -> SYMPTOM_WEIGHTS.getOrDefault(s, 0))
                .sum();

        if (symptomSet.contains("chest_pain") && symptomSet.contains("shortness_of_breath")) score += 15;
        if (symptomSet.contains("severe_headache") && symptomSet.contains("vomiting")) score += 10;
        if (symptomSet.contains("chest_pain") && symptomSet.contains("dizziness")) score += 10;

        if (age >= 65)      score *= 1.4;
        else if (age >= 50) score *= 1.2;
        else if (age < 18)  score *= 0.9;

        score = Math.min(score, 100.0);

        String level;
        String recommendation;
        if (score < 20) {
            level = "LOW";
            recommendation = "No urgent action needed. Monitor your symptoms, rest, and stay hydrated. If symptoms persist beyond 3 days, consult a doctor.";
        } else if (score < 45) {
            level = "MODERATE";
            recommendation = "Consider consulting a doctor within 24-48 hours. Avoid strenuous activity and monitor for worsening symptoms.";
        } else if (score < 70) {
            level = "HIGH";
            recommendation = "Please seek medical attention today. Your symptoms suggest a condition requiring professional evaluation.";
        } else {
            level = "CRITICAL";
            recommendation = "Seek emergency medical care immediately. Call emergency services (112) if you experience sudden worsening.";
        }

        return new RiskResult(level, BigDecimal.valueOf(score).setScale(2, RoundingMode.HALF_UP), recommendation);
    }
}
