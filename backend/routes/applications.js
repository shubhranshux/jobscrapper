const express = require('express');
const db = require('../db/connection');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/applications - Apply to a job
router.post('/', auth, async (req, res) => {
  try {
    const { job_id } = req.body;
    const user_id = req.user.id;

    if (!job_id) {
      return res.status(400).json({ error: 'Job ID is required.' });
    }

    // Check if job exists
    const jobResult = await db.query('SELECT * FROM jobs WHERE id = $1', [job_id]);
    const job = jobResult.rows[0];
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Check if already applied
    const existingApp = await db.query(
      'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      [user_id, job_id]
    );
    if (existingApp.rows.length > 0) {
      return res.status(409).json({ error: 'Already applied to this job.' });
    }

    // Create application
    const result = await db.query(
      `INSERT INTO applications (user_id, job_id, status) VALUES ($1, $2, 'Applied') RETURNING *`,
      [user_id, job_id]
    );
    const application = result.rows[0];

    res.status(201).json({
      message: 'Application submitted successfully.',
      application: {
        ...application,
        job_title: job.title,
        company: job.company,
        platform: job.platform,
        link: job.link
      }
    });
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

// GET /api/applications - Get user's application history
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.id, a.user_id, a.job_id, a.status, a.applied_at,
              j.title AS job_title, j.company, j.location, j.platform, j.link, j.salary
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.user_id = $1
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );

    res.json({
      applications: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
});

// PUT /api/applications/:id - Update application status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Interview', 'Offered', 'Rejected', 'Withdrawn'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const updateResult = await db.query(
      'UPDATE applications SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [status, req.params.id, req.user.id]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    res.json({ message: 'Status updated.', application: updateResult.rows[0] });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application.' });
  }
});

// DELETE /api/applications/:id - Delete application
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM applications WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    res.json({ message: 'Application deleted.' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application.' });
  }
});

module.exports = router;
