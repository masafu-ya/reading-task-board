USE learning_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO users (id, email, password_hash)
VALUES (
  1,
  'legacy@local.invalid',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oGaeK5g3.Zm'
);

-- 既存 DB 向け: user_id カラム（既にある場合はエラー → スキップしてよい）
ALTER TABLE tasks ADD COLUMN user_id INT NOT NULL DEFAULT 1;
ALTER TABLE books ADD COLUMN user_id INT NOT NULL DEFAULT 1;

UPDATE tasks SET user_id = 1;
UPDATE books SET user_id = 1;
