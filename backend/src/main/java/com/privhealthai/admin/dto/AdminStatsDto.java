package com.privhealthai.admin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsDto {

    private long totalUsers;
    private long totalDoctors;
    private long totalAssessments;
    private long totalChatMessages;
    private long totalAppointments;
    private long highRiskAssessments;
    private long criticalRiskAssessments;
}
