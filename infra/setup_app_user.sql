-- Connect to the floragest database as the master user and run these commands
-- to create the limited application user

-- Create the application user
CREATE USER floragest_app WITH PASSWORD 'backend-jera';

-- Grant connect privilege to the database
GRANT CONNECT ON DATABASE floragest TO floragest_app;

-- Grant usage on the app schema
GRANT USAGE ON SCHEMA app TO floragest_app;

-- Grant CRUD privileges on all existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO floragest_app;

-- Grant privileges on all existing sequences (for auto-increment columns)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO floragest_app;

-- Grant privileges on future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO floragest_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT USAGE, SELECT ON SEQUENCES TO floragest_app;

-- Optional: Allow the app user to create tables (needed for migrations)
GRANT CREATE ON SCHEMA app TO floragest_app;
