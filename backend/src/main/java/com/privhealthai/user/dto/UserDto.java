package com.privhealthai.user.dto;

import com.privhealthai.user.entity.UserEntity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserDto {

    private UUID id;
    private String name;
    private String phone;
    private String email;
    private UserEntity.Role role;
    private LocalDateTime createdAt;
}
