package com.privhealthai.auth.service;

import com.privhealthai.auth.dto.AuthResponse;
import com.privhealthai.auth.dto.RegisterRequest;
import com.privhealthai.exception.ApiException;
import com.privhealthai.security.JwtService;
import com.privhealthai.user.entity.UserEntity;
import com.privhealthai.user.repository.UserRepository;
import com.privhealthai.common.util.PhoneNumberUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OtpService otpService;
    private final JwtService jwtService;

    public void register(RegisterRequest request) {
        String normalizedPhone = PhoneNumberUtil.normalizeIndianPhone(request.getPhone());
        if (userRepository.existsByPhone(normalizedPhone)) {
            throw new ApiException("Phone number already registered", HttpStatus.CONFLICT);
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()
                && userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT);
        }
        UserEntity user = UserEntity.builder()
                .name(request.getName())
                .phone(normalizedPhone)
                .email(request.getEmail() != null && !request.getEmail().isBlank()
                        ? request.getEmail() : null)
                .role(UserEntity.Role.USER)
                .build();
        userRepository.save(user);
        otpService.generate(normalizedPhone);
    }

    public void sendOtp(String phone) {
        String normalizedPhone = PhoneNumberUtil.normalizeIndianPhone(phone);
        if (!userRepository.existsByPhone(normalizedPhone)) {
            throw new ApiException("Phone number not registered", HttpStatus.NOT_FOUND);
        }
        otpService.generate(normalizedPhone);
    }

    public AuthResponse verifyOtp(String phone, String otp) {
        String normalizedPhone = PhoneNumberUtil.normalizeIndianPhone(phone);
        if (!otpService.validate(normalizedPhone, otp)) {
            throw new ApiException("Invalid or expired OTP", HttpStatus.UNAUTHORIZED);
        }
        UserEntity user = userRepository.findByPhone(normalizedPhone)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .phone(user.getPhone())
                .name(user.getName())
                .userId(user.getId().toString())
                .role(user.getRole().name())
                .build();
    }
}
