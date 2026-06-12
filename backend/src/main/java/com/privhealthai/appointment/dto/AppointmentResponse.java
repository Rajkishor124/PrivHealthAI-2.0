package com.privhealthai.appointment.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AppointmentResponse {

    private UUID id;
    private UUID doctorId;
    private String doctorName;
    private String specialization;
    private String hospital;
    private String city;
    private LocalDateTime appointmentTime;
    private String reason;
    private String status;
    private LocalDateTime createdAt;
}
