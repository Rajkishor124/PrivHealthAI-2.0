package com.privhealthai.review.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReviewResponse {

    private UUID id;
    private String userName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    /** True when this review belongs to the requesting user. */
    private boolean mine;
}
