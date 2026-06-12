package com.privhealthai.auth.service;

import com.privhealthai.auth.dto.RegisterRequest;
import com.privhealthai.exception.ApiException;
import com.privhealthai.security.JwtService;
import com.privhealthai.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private OtpService otpService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void testDuplicateAccountCannotBeCreatedWithDifferentRepresentations() {
        // First format: 09334456119
        // Second format: 9334456119
        // Both normalize to: +919334456119
        
        RegisterRequest request1 = new RegisterRequest();
        request1.setName("Test User");
        request1.setPhone("09334456119");
        
        RegisterRequest request2 = new RegisterRequest();
        request2.setName("Test User 2");
        request2.setPhone("9334456119");

        // Simulate repository saying that +919334456119 ALREADY EXISTS when request2 is processed
        when(userRepository.existsByPhone("+919334456119")).thenReturn(true);

        // Act & Assert for request2
        ApiException exception = assertThrows(ApiException.class, () -> {
            authService.register(request2);
        });

        assertEquals("Phone number already registered", exception.getMessage());
        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
        
        // Also test sending OTP to different representations
        // Both should trigger sending OTP to +919334456119
        authService.sendOtp("91 9334456119");
        verify(otpService).generate("+919334456119");
    }
}
