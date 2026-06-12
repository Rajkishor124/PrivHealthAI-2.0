package com.privhealthai.admin;

import com.privhealthai.admin.dto.AdminAppointmentDto;
import com.privhealthai.admin.dto.AdminStatsDto;
import com.privhealthai.appointment.AppointmentEntity;
import com.privhealthai.appointment.AppointmentRepository;
import com.privhealthai.assessment.AssessmentRepository;
import com.privhealthai.chatbot.ChatHistoryRepository;
import com.privhealthai.common.PageResponse;
import com.privhealthai.doctor.entity.DoctorEntity;
import com.privhealthai.doctor.repository.DoctorRepository;
import com.privhealthai.user.entity.UserEntity;
import com.privhealthai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AssessmentRepository assessmentRepository;
    private final ChatHistoryRepository chatHistoryRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminStatsDto getStats() {
        return AdminStatsDto.builder()
                .totalUsers(userRepository.count())
                .totalDoctors(doctorRepository.count())
                .totalAssessments(assessmentRepository.count())
                .totalChatMessages(chatHistoryRepository.count())
                .totalAppointments(appointmentRepository.count())
                .highRiskAssessments(assessmentRepository.countByRiskLevel("HIGH"))
                .criticalRiskAssessments(assessmentRepository.countByRiskLevel("CRITICAL"))
                .build();
    }

    public PageResponse<AdminAppointmentDto> listAppointments(int page, int size) {
        Page<AppointmentEntity> result = appointmentRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "appointmentTime")));

        List<AppointmentEntity> content = result.getContent();
        Map<UUID, String> patientNames = content.isEmpty() ? Map.of()
                : userRepository.findAllById(content.stream().map(AppointmentEntity::getUserId).distinct().toList())
                    .stream().collect(Collectors.toMap(UserEntity::getId, UserEntity::getName));
        Map<UUID, DoctorEntity> doctors = content.isEmpty() ? Map.of()
                : doctorRepository.findAllById(content.stream().map(AppointmentEntity::getDoctorId).distinct().toList())
                    .stream().collect(Collectors.toMap(DoctorEntity::getId, Function.identity()));

        List<AdminAppointmentDto> dtos = content.stream().map(a -> {
            DoctorEntity d = doctors.get(a.getDoctorId());
            return AdminAppointmentDto.builder()
                    .id(a.getId())
                    .patientName(patientNames.getOrDefault(a.getUserId(), "Unknown"))
                    .doctorName(d != null ? d.getFullName() : "Unknown")
                    .specialization(d != null ? d.getSpecialization() : null)
                    .appointmentTime(a.getAppointmentTime())
                    .status(a.getStatus())
                    .reason(a.getReason())
                    .createdAt(a.getCreatedAt())
                    .build();
        }).toList();

        return PageResponse.<AdminAppointmentDto>builder()
                .content(dtos)
                .pageNumber(result.getNumber())
                .pageSize(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }
}
