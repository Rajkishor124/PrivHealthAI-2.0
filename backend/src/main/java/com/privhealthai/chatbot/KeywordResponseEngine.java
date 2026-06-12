package com.privhealthai.chatbot;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class KeywordResponseEngine {

    private final Map<String, String> responses = new LinkedHashMap<>();

    private static final String DEFAULT_RESPONSE =
            "I'm your PrivHealthAI assistant. I can help you with general health information, " +
            "finding doctors, and understanding symptoms. For emergencies, always call 112.";

    @PostConstruct
    public void init() {
        responses.put("chest pain",
                "Chest pain can have many causes. If it is severe, sudden, or radiates to your arm or jaw, " +
                "call emergency services (112) immediately. Otherwise, consult a doctor today.");
        responses.put("headache",
                "Headaches are common but can be serious if sudden and severe. Stay hydrated, rest in a " +
                "dark room, and avoid screens. See a doctor if they persist beyond 48 hours or worsen suddenly.");
        responses.put("fever",
                "A fever above 38°C indicates your body is fighting an infection. Rest, stay hydrated, " +
                "and use paracetamol if needed. Seek care if it exceeds 39.5°C or lasts more than 3 days.");
        responses.put("diabetes",
                "Diabetes management requires regular blood sugar monitoring, a balanced low-sugar diet, " +
                "regular exercise, and prescribed medication. Regular check-ups with an endocrinologist are essential.");
        responses.put("blood pressure",
                "Normal blood pressure is below 120/80 mmHg. Hypertension can be managed with lifestyle " +
                "changes, reduced salt intake, exercise, and medication if prescribed by your doctor.");
        responses.put("doctor",
                "You can find verified doctors on our platform. Use the Doctors section to filter by " +
                "specialization and city to find the right specialist for your needs.");
        responses.put("symptom",
                "To get a personalised risk assessment, please use our Symptom Assessment tool. It provides " +
                "a risk score based on your symptoms, age, and gender.");
        responses.put("medicine",
                "Never self-medicate without professional advice. If you have questions about a prescribed " +
                "medication, consult your pharmacist or the prescribing doctor directly.");
        responses.put("appointment",
                "To book an appointment, find a doctor through our search, view their profile, and use the " +
                "contact information listed to reach their clinic directly.");
        responses.put("emergency",
                "If you are experiencing a medical emergency — difficulty breathing, chest pain, loss of " +
                "consciousness — call emergency services (112) immediately. Do not delay.");
    }

    public String getResponse(String userMessage) {
        String lower = userMessage.toLowerCase();
        for (Map.Entry<String, String> entry : responses.entrySet()) {
            if (lower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return DEFAULT_RESPONSE;
    }
}
