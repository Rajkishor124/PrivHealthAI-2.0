-- ============================================================
-- V8: Favorite (bookmarked) doctors
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
    id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID      NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    doctor_id  UUID      NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_favorite_user_doctor UNIQUE (user_id, doctor_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites (user_id);
