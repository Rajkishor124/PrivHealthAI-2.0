package com.privhealthai.user.service;

import com.privhealthai.common.PageResponse;
import com.privhealthai.exception.ResourceNotFoundException;
import com.privhealthai.user.dto.UserDto;
import com.privhealthai.user.entity.UserEntity;
import com.privhealthai.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDto findById(UUID id) {
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return toDto(entity);
    }

    public PageResponse<UserDto> findAll(int page, int size) {
        Page<UserEntity> result = userRepository.findAll(PageRequest.of(page, size));
        return PageResponse.<UserDto>builder()
                .content(result.getContent().stream().map(this::toDto).toList())
                .pageNumber(result.getNumber())
                .pageSize(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    private UserDto toDto(UserEntity e) {
        return UserDto.builder()
                .id(e.getId())
                .name(e.getName())
                .phone(e.getPhone())
                .email(e.getEmail())
                .role(e.getRole())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
