package com.privhealthai.appointment;

import com.privhealthai.appointment.dto.AppointmentRequest;
import com.privhealthai.appointment.dto.AppointmentResponse;
import com.privhealthai.doctor.entity.DoctorEntity;
import com.privhealthai.doctor.repository.DoctorRepository;
import com.privhealthai.exception.ApiException;
import com.privhealthai.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private static final String STATUS_BOOKED = "BOOKED";
    private static final String STATUS_CANCELLED = "CANCELLED";

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;

    @Transactional
    public AppointmentResponse book(AppointmentRequest request, UUID userId) {
        DoctorEntity doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", request.getDoctorId()));

        boolean slotTaken = appointmentRepository.existsByDoctorIdAndAppointmentTimeAndStatusNot(
                doctor.getId(), request.getAppointmentTime(), STATUS_CANCELLED);
        if (slotTaken) {
            throw new ApiException("That time slot is already booked. Please choose another.",
                    HttpStatus.CONFLICT);
        }

        AppointmentEntity entity = AppointmentEntity.builder()
                .userId(userId)
                .doctorId(doctor.getId())
                .appointmentTime(request.getAppointmentTime())
                .reason(request.getReason())
                .status(STATUS_BOOKED)
                .build();

        entity = appointmentRepository.save(entity);
        return toResponse(entity, doctor);
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> listForUser(UUID userId) {
        List<AppointmentEntity> appointments =
                appointmentRepository.findByUserIdOrderByAppointmentTimeDesc(userId);
        if (appointments.isEmpty()) return List.of();

        List<UUID> doctorIds = appointments.stream()
                .map(AppointmentEntity::getDoctorId)
                .distinct()
                .toList();
        Map<UUID, DoctorEntity> doctors = doctorRepository.findAllById(doctorIds).stream()
                .collect(Collectors.toMap(DoctorEntity::getId, Function.identity()));

        return appointments.stream()
                .map(a -> toResponse(a, doctors.get(a.getDoctorId())))
                .toList();
    }

    @Transactional
    public AppointmentResponse cancel(UUID appointmentId, UUID userId) {
        AppointmentEntity entity = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", appointmentId));

        if (!entity.getUserId().equals(userId)) {
            throw new ApiException("You can only cancel your own appointments", HttpStatus.FORBIDDEN);
        }
        if (STATUS_CANCELLED.equals(entity.getStatus())) {
            throw new ApiException("Appointment is already cancelled", HttpStatus.BAD_REQUEST);
        }

        entity.setStatus(STATUS_CANCELLED);
        entity = appointmentRepository.save(entity);
        return toResponse(entity, doctorRepository.findById(entity.getDoctorId()).orElse(null));
    }

    private AppointmentResponse toResponse(AppointmentEntity a, DoctorEntity doctor) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .doctorId(a.getDoctorId())
                .doctorName(doctor != null ? doctor.getFullName() : "Unknown doctor")
                .specialization(doctor != null ? doctor.getSpecialization() : null)
                .hospital(doctor != null ? doctor.getHospital() : null)
                .city(doctor != null ? doctor.getCity() : null)
                .appointmentTime(a.getAppointmentTime())
                .reason(a.getReason())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
