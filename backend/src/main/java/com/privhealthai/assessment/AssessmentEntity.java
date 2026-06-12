package com.privhealthai.assessment;

import com.privhealthai.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "symptom_assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentEntity extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String symptoms;

    @Column
    private Integer age;

    @Column(length = 20)
    private String gender;

    @Column(name = "risk_score", precision = 5, scale = 2)
    private BigDecimal riskScore;

    @Column(name = "risk_level", length = 20)
    private String riskLevel;

    @Column(columnDefinition = "TEXT")
    private String recommendation;

    @Column(name = "additional_symptoms", columnDefinition = "TEXT")
    private String additionalSymptoms;

    @Column(name = "possible_conditions", columnDefinition = "TEXT")
    private String possibleConditions;

    @Column(name = "suggested_medicines", columnDefinition = "TEXT")
    private String suggestedMedicines;

    @Column(name = "recommended_specialization", length = 100)
    private String recommendedSpecialization;

    @Column(name = "ai_advice", columnDefinition = "TEXT")
    private String aiAdvice;
}
