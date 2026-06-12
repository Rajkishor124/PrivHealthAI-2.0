package com.privhealthai.assessment.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class AssessmentRequest {

    @NotNull
    @Size(min = 1, message = "Select at least one symptom")
    private List<String> symptoms;

    @Min(1)
    @Max(120)
    private int age;

    @NotBlank
    private String gender;

    /** Optional free-text symptoms typed by the user (e.g. "burning sensation in left arm"). */
    @Size(max = 1000, message = "Additional symptoms must be under 1000 characters")
    private String additionalSymptoms;
}
