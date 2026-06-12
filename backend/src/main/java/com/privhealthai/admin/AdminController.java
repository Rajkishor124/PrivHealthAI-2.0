package com.privhealthai.admin;

import com.privhealthai.admin.dto.AdminAppointmentDto;
import com.privhealthai.admin.dto.AdminStatsDto;
import com.privhealthai.common.ApiResponse;
import com.privhealthai.common.PageResponse;
import com.privhealthai.doctor.dto.DoctorDto;
import com.privhealthai.doctor.service.DoctorService;
import com.privhealthai.user.dto.UserDto;
import com.privhealthai.user.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final DoctorService doctorService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PageResponse<UserDto>>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(userService.findAll(page, size)));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<PageResponse<DoctorDto>>> getDoctors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.findAll(page, size)));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<PageResponse<AdminAppointmentDto>>> getAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(adminService.listAppointments(page, size)));
    }
}
