package com.privhealthai.doctor.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class DoctorDto {

    private UUID id;
    private String fullName;
    private String specialization;
    private String qualification;
    private Integer experienceYears;
    private String city;
    private String country;
    private String hospital;
    private String contactInfo;
    private BigDecimal rating;
    private String licenseNumber;
    private LocalDateTime createdAt;
}
