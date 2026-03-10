const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection and create tables
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon PostgreSQL database');

    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        skills TEXT,
        bio TEXT,
        profile_image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        company VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        platform VARCHAR(100) NOT NULL,
        link TEXT,
        description TEXT,
        salary VARCHAR(100),
        job_type VARCHAR(50),
        scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'Applied',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, job_id)
      );

      CREATE INDEX IF NOT EXISTS idx_jobs_platform ON jobs(platform);
      CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
      CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
    `);

    console.log('✅ PostgreSQL tables ready');
    client.release();
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
  }
})();

module.exports = pool;
