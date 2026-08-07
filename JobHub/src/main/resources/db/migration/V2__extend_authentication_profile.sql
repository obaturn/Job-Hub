ALTER TABLE users
    ADD COLUMN first_name VARCHAR(80),
    ADD COLUMN last_name VARCHAR(80);

ALTER TABLE refresh_tokens
    ADD COLUMN remember_me BOOLEAN NOT NULL DEFAULT TRUE;
