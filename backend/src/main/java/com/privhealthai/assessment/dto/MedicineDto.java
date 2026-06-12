package com.privhealthai.assessment.dto;

/** An over-the-counter medicine suggestion from the AI analysis. */
public record MedicineDto(String name, String purpose, String note) {}
