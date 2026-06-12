package com.privhealthai.chatbot.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ChatResponse {

    private UUID id;
    private String message;
    private String response;
    private LocalDateTime createdAt;

    /** Card-friendly structured form of {@code response}; null when the keyword fallback is used. */
    private ChatStructured structured;
}
