package com.privhealthai.favorite;

import com.privhealthai.doctor.dto.DoctorDto;
import com.privhealthai.doctor.repository.DoctorRepository;
import com.privhealthai.doctor.service.DoctorService;
import com.privhealthai.exception.ResourceNotFoundException;
import com.privhealthai.favorite.dto.FavoriteToggleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorService doctorService;

    @Transactional(readOnly = true)
    public boolean isFavorited(UUID userId, UUID doctorId) {
        return favoriteRepository.existsByUserIdAndDoctorId(userId, doctorId);
    }

    /** Add the doctor to favorites if absent, otherwise remove it. Returns the new state. */
    @Transactional
    public FavoriteToggleResponse toggle(UUID userId, UUID doctorId) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor", "id", doctorId);
        }
        return favoriteRepository.findByUserIdAndDoctorId(userId, doctorId)
                .map(existing -> {
                    favoriteRepository.delete(existing);
                    return new FavoriteToggleResponse(false);
                })
                .orElseGet(() -> {
                    favoriteRepository.save(FavoriteEntity.builder()
                            .userId(userId).doctorId(doctorId).build());
                    return new FavoriteToggleResponse(true);
                });
    }

    /** The user's favorite doctors, most-recently-favorited first. */
    @Transactional(readOnly = true)
    public List<DoctorDto> listForUser(UUID userId) {
        List<UUID> doctorIds = favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(FavoriteEntity::getDoctorId)
                .toList();
        if (doctorIds.isEmpty()) return List.of();

        Map<UUID, DoctorDto> byId = doctorService.findByIds(doctorIds).stream()
                .collect(Collectors.toMap(DoctorDto::getId, Function.identity()));

        // Preserve favorite order (findByIds may reorder); skip any doctor since deleted.
        return doctorIds.stream().map(byId::get).filter(d -> d != null).toList();
    }
}
