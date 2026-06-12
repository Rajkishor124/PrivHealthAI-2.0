package com.privhealthai.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AdminAppointmentDto {

    private UUID id;
    private String patientName;
    private String doctorName;
    private String specialization;
    private LocalDateTime appointmentTime;
    private String status;
    private String reason;
    private LocalDateTime createdAt;
}
