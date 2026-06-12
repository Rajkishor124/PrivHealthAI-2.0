package com.privhealthai.doctor.service;

import com.privhealthai.common.PageResponse;
import com.privhealthai.doctor.dto.DoctorDto;
import com.privhealthai.doctor.entity.DoctorEntity;
import com.privhealthai.doctor.repository.DoctorRepository;
import com.privhealthai.exception.ResourceNotFoundException;
import com.privhealthai.review.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ReviewRepository reviewRepository;

    public DoctorDto findById(UUID id) {
        DoctorEntity entity = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        DoctorDto dto = toDto(entity);
        // Prefer the live average from real reviews; fall back to the seeded rating when none exist.
        Double avg = reviewRepository.averageRatingForDoctor(id);
        if (avg != null) {
            dto.setRating(BigDecimal.valueOf(Math.round(avg * 10) / 10.0));
        }
        return dto;
    }

    public PageResponse<DoctorDto> findAll(int page, int size) {
        Page<DoctorEntity> result = doctorRepository.findAll(PageRequest.of(page, size));
        return PageResponse.<DoctorDto>builder()
                .content(result.getContent().stream().map(this::toDto).toList())
                .pageNumber(result.getNumber())
                .pageSize(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    public PageResponse<DoctorDto> search(String specialization, String city, int page, int size) {
        Specification<DoctorEntity> spec = Specification.where(null);
        if (specialization != null && !specialization.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("specialization")),
                            "%" + specialization.toLowerCase() + "%"));
        }
        if (city != null && !city.isBlank()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("city")),
                            "%" + city.toLowerCase() + "%"));
        }
        Page<DoctorEntity> result = doctorRepository.findAll(spec, PageRequest.of(page, size));
        return PageResponse.<DoctorDto>builder()
                .content(result.getContent().stream().map(this::toDto).toList())
                .pageNumber(result.getNumber())
                .pageSize(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    /** Map a set of doctors by id to DTOs (seeded rating; used by favorites). */
    public List<DoctorDto> findByIds(Collection<UUID> ids) {
        return doctorRepository.findAllById(ids).stream().map(this::toDto).toList();
    }

    private DoctorDto toDto(DoctorEntity e) {
        return DoctorDto.builder()
                .id(e.getId())
                .fullName(e.getFullName())
                .specialization(e.getSpecialization())
                .qualification(e.getQualification())
                .experienceYears(e.getExperienceYears())
                .city(e.getCity())
                .country(e.getCountry())
                .hospital(e.getHospital())
                .contactInfo(e.getContactInfo())
                .rating(e.getRating())
                .licenseNumber(e.getLicenseNumber())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
