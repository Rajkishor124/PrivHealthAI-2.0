package com.privhealthai.review;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, UUID> {

    List<ReviewEntity> findByDoctorIdOrderByCreatedAtDesc(UUID doctorId);

    Optional<ReviewEntity> findByUserIdAndDoctorId(UUID userId, UUID doctorId);

    long countByDoctorId(UUID doctorId);

    @Query("SELECT AVG(r.rating) FROM ReviewEntity r WHERE r.doctorId = :doctorId")
    Double averageRatingForDoctor(@Param("doctorId") UUID doctorId);
}
