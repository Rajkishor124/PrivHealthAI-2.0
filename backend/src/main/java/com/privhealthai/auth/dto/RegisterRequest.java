package com.privhealthai.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Pattern(regexp = "^\\+?[0-9\\s\\-\\(\\)]{7,25}$", message = "Invalid phone number format")
    private String phone;

    @Email
    private String email;
}
