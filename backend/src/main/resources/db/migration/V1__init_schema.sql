CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(50)  NOT NULL DEFAULT 'USER',
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE TABLE IF NOT EXISTS doctors (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name        VARCHAR(255) NOT NULL,
    specialization   VARCHAR(255) NOT NULL,
    qualification    VARCHAR(255),
    experience_years INTEGER,
    city             VARCHAR(100),
    country          VARCHAR(100),
    rating           NUMERIC(3,2),
    license_number   VARCHAR(100) NOT NULL,
    created_at       TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT uq_doctors_license UNIQUE (license_number)
);

CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors (specialization);
CREATE INDEX IF NOT EXISTS idx_doctors_city ON doctors (city);
CREATE INDEX IF NOT EXISTS idx_doctors_country ON doctors (country);
