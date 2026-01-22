CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  github_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL UNIQUE,
  webhook_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS changelogs (
  id SERIAL PRIMARY KEY,
  repo_name VARCHAR(255) NOT NULL, -- denormalized for easier lookup
  version VARCHAR(50),
  changes JSONB NOT NULL, -- stores features, fixes, improvements
  raw_commits JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
