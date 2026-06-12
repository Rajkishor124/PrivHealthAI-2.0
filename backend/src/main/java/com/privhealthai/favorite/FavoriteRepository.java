package com.privhealthai.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<FavoriteEntity, UUID> {

    List<FavoriteEntity> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<FavoriteEntity> findByUserIdAndDoctorId(UUID userId, UUID doctorId);

    boolean existsByUserIdAndDoctorId(UUID userId, UUID doctorId);
}
