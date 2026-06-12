package com.privhealthai.chatbot.dto;

import java.util.List;

/**
 * Structured, card-friendly chatbot reply.
 *
 * <p>{@code type} is either:
 * <ul>
 *   <li>{@code "symptom"} – the user described how they feel; the structured fields are filled
 *       and the frontend renders a stack of medical cards.</li>
 *   <li>{@code "info"} – greeting / definition / medication / general question; only {@code reply}
 *       is filled (concise, optionally with bullets).</li>
 * </ul>
 */
public record ChatStructured(
        String type,
        String reply,
        String summary,
        List<String> possibleCauses,
        List<String> actions,
        List<String> avoid,
        String riskLevel,
        String recommendedSpecialist,
        List<String> emergencyWarning
) {}
