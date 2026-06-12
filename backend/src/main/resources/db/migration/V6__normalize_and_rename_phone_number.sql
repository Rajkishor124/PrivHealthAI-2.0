-- ============================================================
-- V6: Normalize Indian Phone Numbers and Rename Column
-- (originally authored as V3; renumbered to V6 so it applies
--  after V3__seed_doctors / V4 / V5 which were already applied)
-- ============================================================

-- Step 1: Clean characters (remove spaces, hyphens, brackets)
UPDATE users SET phone = regexp_replace(phone, '[ \-\(\)]', '', 'g');

-- Step 2: Normalize prefixes to E.164
-- 10 digits starting with 6-9
UPDATE users SET phone = '+91' || phone WHERE phone ~ '^[6-9]\d{9}$';
-- 11 digits starting with 0 followed by 6-9
UPDATE users SET phone = '+91' || substring(phone from 2) WHERE phone ~ '^0[6-9]\d{9}$';
-- 12 digits starting with 91 followed by 6-9
UPDATE users SET phone = '+' || phone WHERE phone ~ '^91[6-9]\d{9}$';

-- Step 3: Delete duplicates (keeping the one with the earliest created_at)
-- This ensures the unique constraint won't fail if different representations of the same number existed.
DELETE FROM users
WHERE id IN (
    SELECT id
    FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at ASC) as rnum
        FROM users
    ) t
    WHERE t.rnum > 1
);

-- Step 4: Rename column and apply changes
ALTER TABLE users RENAME COLUMN phone TO phone_number;
ALTER TABLE users ALTER COLUMN phone_number TYPE VARCHAR(15);

-- Rename constraints and indexes for clean naming
ALTER TABLE users RENAME CONSTRAINT uq_users_phone TO uq_users_phone_number;
ALTER INDEX IF EXISTS idx_users_phone RENAME TO idx_users_phone_number;
