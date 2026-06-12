-- ============================================================
-- V5: Appointments
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID         NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    doctor_id        UUID         NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_time TIMESTAMP    NOT NULL,
    reason           TEXT,
    status           VARCHAR(20)  NOT NULL DEFAULT 'BOOKED',
    created_at       TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointments_user_id   ON appointments (user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments (doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_slot      ON appointments (doctor_id, appointment_time);
