package com.privhealthai.appointment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Periodically marks BOOKED appointments whose time has passed as COMPLETED,
 * so the appointment lifecycle reflects real visits without manual intervention.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentScheduler {

    private final AppointmentRepository appointmentRepository;

    /** Runs ~10s after startup, then every 5 minutes. */
    @Scheduled(initialDelay = 10_000, fixedRate = 300_000)
    @Transactional
    public void completePastAppointments() {
        int updated = appointmentRepository.completePastAppointments(LocalDateTime.now());
        if (updated > 0) {
            log.info("Auto-completed {} past appointment(s)", updated);
        }
    }
}
