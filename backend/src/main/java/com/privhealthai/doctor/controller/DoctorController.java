package com.privhealthai.doctor.controller;

import com.privhealthai.common.ApiResponse;
import com.privhealthai.common.PageResponse;
import com.privhealthai.doctor.dto.DoctorDto;
import com.privhealthai.doctor.service.DoctorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctors")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<DoctorDto>>> search(
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.search(specialization, city, page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDto>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.findById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<DoctorDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.findAll(page, size)));
    }
}
