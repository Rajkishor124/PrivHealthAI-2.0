package com.privhealthai.appointment;

import com.privhealthai.appointment.dto.AppointmentRequest;
import com.privhealthai.appointment.dto.AppointmentResponse;
import com.privhealthai.common.ApiResponse;
import com.privhealthai.user.entity.UserEntity;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointments")
@SecurityRequirement(name = "bearerAuth")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> book(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(appointmentService.book(request, user.getId())));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> myAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        return ResponseEntity.ok(ApiResponse.success(appointmentService.listForUser(user.getId())));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponse>> cancel(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        UserEntity user = (UserEntity) userDetails;
        return ResponseEntity.ok(ApiResponse.success(appointmentService.cancel(id, user.getId())));
    }
}
