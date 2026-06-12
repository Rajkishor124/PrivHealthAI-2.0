package com.privhealthai.assessment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.privhealthai.assessment.dto.AssessmentRequest;
import com.privhealthai.assessment.dto.AssessmentResponse;
import com.privhealthai.chatbot.OpenRouterClient;
import com.privhealthai.doctor.dto.DoctorDto;
import com.privhealthai.doctor.entity.DoctorEntity;
import com.privhealthai.doctor.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final DoctorRepository doctorRepository;
    private final RiskEngine riskEngine;
    private final AssessmentAiEngine aiEngine;
    private final OpenRouterClient openRouterClient;
    private final ObjectMapper objectMapper;

    public AssessmentResponse submit(AssessmentRequest request, UUID userId) {
        RiskEngine.RiskResult result = riskEngine.evaluate(
                request.getSymptoms(), request.getAge(), request.getGender());

        AssessmentAiEngine.AiAnalysis ai = null;
        if (openRouterClient.isEnabled()) {
            try {
                ai = aiEngine.analyze(
                        request.getSymptoms(), request.getAdditionalSymptoms(),
                        request.getAge(), request.getGender(), result.riskLevel());
            } catch (Exception e) {
                log.warn("AI assessment failed, returning rule-engine result only: {}", e.getMessage());
            }
        }

        List<DoctorDto> recommendedDoctors = ai != null
                ? findDoctors(ai.recommendedSpecialization())
                : List.of();

        AssessmentEntity entity = AssessmentEntity.builder()
                .userId(userId)
                .symptoms(toJson(request.getSymptoms()))
                .age(request.getAge())
                .gender(request.getGender())
                .riskScore(result.riskScore())
                .riskLevel(result.riskLevel())
                .recommendation(result.recommendation())
                .additionalSymptoms(request.getAdditionalSymptoms())
                .possibleConditions(ai != null ? toJson(ai.possibleConditions()) : null)
                .suggestedMedicines(ai != null ? toJson(ai.medicines()) : null)
                .recommendedSpecialization(ai != null ? ai.recommendedSpecialization() : null)
                .aiAdvice(ai != null ? ai.advice() : null)
                .build();

        entity = assessmentRepository.save(entity);

        return AssessmentResponse.builder()
                .id(entity.getId())
                .riskLevel(entity.getRiskLevel())
                .riskScore(entity.getRiskScore())
                .recommendation(entity.getRecommendation())
                .symptoms(request.getSymptoms())
                .additionalSymptoms(request.getAdditionalSymptoms())
                .age(request.getAge())
                .gender(request.getGender())
                .createdAt(entity.getCreatedAt())
                .aiPowered(ai != null)
                .possibleConditions(ai != null ? ai.possibleConditions() : List.of())
                .medicines(ai != null ? ai.medicines() : List.of())
                .recommendedSpecialization(ai != null ? ai.recommendedSpecialization() : null)
                .aiAdvice(ai != null ? ai.advice() : null)
                .recommendedDoctors(recommendedDoctors)
                .build();
    }

    /** Top 3 doctors for the AI-recommended specialization, best rated first. */
    private List<DoctorDto> findDoctors(String specialization) {
        if (specialization == null || specialization.isBlank()) return List.of();
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization.trim()).stream()
                .sorted(Comparator.comparing(DoctorEntity::getRating,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(3)
                .map(this::toDto)
                .toList();
    }

    private DoctorDto toDto(DoctorEntity d) {
        return DoctorDto.builder()
                .id(d.getId())
                .fullName(d.getFullName())
                .specialization(d.getSpecialization())
                .qualification(d.getQualification())
                .experienceYears(d.getExperienceYears())
                .city(d.getCity())
                .country(d.getCountry())
                .hospital(d.getHospital())
                .contactInfo(d.getContactInfo())
                .rating(d.getRating() != null ? d.getRating() : BigDecimal.ZERO)
                .licenseNumber(d.getLicenseNumber())
                .createdAt(d.getCreatedAt())
                .build();
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            return String.valueOf(value);
        }
    }
}
