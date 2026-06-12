-- ============================================================
-- V9: Seed Admin User
-- ============================================================

INSERT INTO users (id, name, phone_number, email, role, password_hash, created_at)
VALUES (
    gen_random_uuid(),
    'System Administrator',
    '+919999999999',
    'admin@privhealthai.com',
    'ADMIN',
    '$2a$10$2S7z.TylXjBly9Q.B2Uqxea95b8.8zVre2.gXWw5G5p.7D7xG.L6i', -- bcrypt of 'admin123'
    now()
) ON CONFLICT (phone_number) DO NOTHING;
