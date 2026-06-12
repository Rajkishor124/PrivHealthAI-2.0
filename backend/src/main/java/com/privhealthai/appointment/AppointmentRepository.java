package com.privhealthai.appointment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, UUID> {

    List<AppointmentEntity> findByUserIdOrderByAppointmentTimeDesc(UUID userId);

    /** True when an active (non-cancelled) booking already holds this doctor's slot. */
    boolean existsByDoctorIdAndAppointmentTimeAndStatusNot(UUID doctorId, LocalDateTime time, String status);

    /** True when the user has a non-cancelled appointment with the doctor (gates review eligibility). */
    boolean existsByUserIdAndDoctorIdAndStatusNot(UUID userId, UUID doctorId, String status);

    /** Flip BOOKED appointments whose time has passed to COMPLETED; returns the number updated. */
    @Modifying
    @Query("UPDATE AppointmentEntity a SET a.status = 'COMPLETED' "
            + "WHERE a.status = 'BOOKED' AND a.appointmentTime < :now")
    int completePastAppointments(@Param("now") LocalDateTime now);
}
