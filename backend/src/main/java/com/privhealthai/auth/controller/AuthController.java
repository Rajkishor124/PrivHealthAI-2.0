package com.privhealthai.auth.controller;

import com.privhealthai.auth.dto.AuthResponse;
import com.privhealthai.auth.dto.RegisterRequest;
import com.privhealthai.auth.dto.SendOtpRequest;
import com.privhealthai.auth.dto.VerifyOtpRequest;
import com.privhealthai.auth.service.AuthService;
import com.privhealthai.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Register a new patient account")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(
            @Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registered successfully. OTP sent to " + request.getPhone(), null));
    }

    @Operation(summary = "Send OTP to phone (login flow)")
    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Void>> sendOtp(
            @Valid @RequestBody SendOtpRequest request) {
        authService.sendOtp(request.getPhone());
        return ResponseEntity.ok(
                ApiResponse.success("OTP sent to " + request.getPhone(), null));
    }

    @Operation(summary = "Verify OTP and receive JWT token")
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtp(request.getPhone(), request.getOtp());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
