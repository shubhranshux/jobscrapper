const express = require('express');
const db = require('../db/connection');
const auth = require('../middleware/auth');
const { scrapeJobs } = require('../services/scraper');

const router = express.Router();

// POST /api/jobs/scrape - Scrape jobs from platforms
router.post('/scrape', auth, async (req, res) => {
  try {
    const { keyword, location } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required.' });
    }

    // Scrape jobs
    const scrapedJobs = await scrapeJobs(keyword, location || '');

    // Insert into database using a transaction
    const client = await db.connect();
    const insertedJobs = [];

    try {
      await client.query('BEGIN');

      for (const job of scrapedJobs) {
        const result = await client.query(
          `INSERT INTO jobs (title, company, location, platform, link, description, salary, job_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
          [job.title, job.company, job.location, job.platform,
           job.link, job.description, job.salary, job.job_type]
        );
        insertedJobs.push({ id: result.rows[0].id, ...job });
      }

      await client.query('COMMIT');
    } catch (txError) {
      await client.query('ROLLBACK');
      throw txError;
    } finally {
      client.release();
    }

    res.json({
      message: `Found ${insertedJobs.length} jobs for "${keyword}"${location ? ` in ${location}` : ''}.`,
      jobs: insertedJobs,
      count: insertedJobs.length
    });
  } catch (error) {
    console.error('Scrape error:', error);
    res.status(500).json({ error: 'Failed to scrape jobs.' });
  }
});

// GET /api/jobs - Get all jobs with optional filters
router.get('/', auth, async (req, res) => {
  try {
    const { platform, location, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (platform) {
      query += ` AND platform = $${paramIndex++}`;
      params.push(platform);
    }

    if (location) {
      query += ` AND location ILIKE $${paramIndex++}`;
      params.push(`%${location}%`);
    }

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR company ILIKE $${paramIndex + 1})`;
      params.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    query += ` ORDER BY scraped_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    res.json({
      jobs: result.rows,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    const job = result.rows[0];
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job.' });
  }
});

module.exports = router;
