-- ============================================================
-- V2: Switch to phone-based auth, add missing columns/tables
-- ============================================================

-- Make phone the primary login identifier
ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT uq_users_phone UNIQUE (phone);

-- Email is now optional (unique constraint stays — PostgreSQL allows multiple NULLs in unique index)
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- password_hash no longer needed for OTP auth
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone);

-- Add hospital and contact_info to doctors
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS hospital    VARCHAR(255);
ALTER TABLE doctors ADD COLUMN IF NOT EXISTS contact_info VARCHAR(255);

-- ============================================================
-- Symptom Assessments
-- ============================================================
CREATE TABLE IF NOT EXISTS symptom_assessments (
    id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symptoms       TEXT         NOT NULL,
    age            INTEGER,
    gender         VARCHAR(20),
    risk_score     NUMERIC(5,2),
    risk_level     VARCHAR(20),
    recommendation TEXT,
    created_at     TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assessments_user_id  ON symptom_assessments (user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_risk_level ON symptom_assessments (risk_level);

-- ============================================================
-- Chat History
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_history (
    id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message    TEXT      NOT NULL,
    response   TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history (user_id);
