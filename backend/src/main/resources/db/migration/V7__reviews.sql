-- ============================================================
-- V7: Doctor Reviews & Ratings
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID      NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    doctor_id  UUID      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    rating     INTEGER   NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_review_user_doctor UNIQUE (user_id, doctor_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_doctor_id ON reviews (doctor_id);
