package com.privhealthai.assessment.dto;

/** A possible condition suggested by the AI analysis. */
public record ConditionDto(String name, String likelihood, String description) {}
