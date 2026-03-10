const express = require('express');
const db = require('../db/connection');
const auth = require('../middleware/auth');
const { summarizeJob, extractSkills, matchJobToProfile, getRecommendations, chatAssistant, getKeywordFromProfile, smartFilterJobs } = require('../services/aiService');
const { scrapeJobs } = require('../services/scraper');

const router = express.Router();

// POST /api/ai/summarize
router.post('/summarize', auth, async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Job description is required.' });
    }
    const result = await summarizeJob(description);
    res.json(result);
  } catch (error) {
    console.error('AI summarize error:', error);
    res.status(500).json({ error: 'AI summarization failed.' });
  }
});

// POST /api/ai/skills
router.post('/skills', auth, async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Job description is required.' });
    }
    const result = await extractSkills(description);
    res.json(result);
  } catch (error) {
    console.error('AI skills error:', error);
    res.status(500).json({ error: 'Skill extraction failed.' });
  }
});

// POST /api/ai/match
router.post('/match', auth, async (req, res) => {
  try {
    const { job_id } = req.body;
    if (!job_id) {
      return res.status(400).json({ error: 'Job ID is required.' });
    }

    // Get job
    const jobResult = await db.query('SELECT * FROM jobs WHERE id = $1', [job_id]);
    const job = jobResult.rows[0];
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    // Get user profile
    const profileResult = await db.query(
      'SELECT name, skills, bio FROM users WHERE id = $1',
      [req.user.id]
    );
    const userProfile = profileResult.rows[0];

    const result = await matchJobToProfile(job.description, userProfile);
    res.json(result);
  } catch (error) {
    console.error('AI match error:', error);
    res.status(500).json({ error: 'Job matching failed.' });
  }
});

// POST /api/ai/recommend
router.post('/recommend', auth, async (req, res) => {
  try {
    const { recent_searches } = req.body;

    const profileResult = await db.query(
      'SELECT name, skills, bio FROM users WHERE id = $1',
      [req.user.id]
    );
    const userProfile = profileResult.rows[0];

    const result = await getRecommendations(userProfile, recent_searches);
    res.json(result);
  } catch (error) {
    console.error('AI recommend error:', error);
    res.status(500).json({ error: 'Recommendations failed.' });
  }
});

// POST /api/ai/recommend-jobs
// Scrapes actual jobs based on the user's profile
router.post('/recommend-jobs', auth, async (req, res) => {
  try {
    const profileResult = await db.query(
      'SELECT name, skills, bio FROM users WHERE id = $1',
      [req.user.id]
    );
    const userProfile = profileResult.rows[0];

    const keyword = await getKeywordFromProfile(userProfile);
    
    // Scrape jobs based on the AI-determined keyword and a generic location / remote
    const jobs = await scrapeJobs(keyword, 'India');
    
    res.json({ keyword, jobs, count: jobs.length });
  } catch (error) {
    console.error('AI recommend-jobs error:', error);
    res.status(500).json({ error: 'Failed to recommend jobs.' });
  }
});

// POST /api/ai/filter-jobs
router.post('/filter-jobs', auth, async (req, res) => {
  try {
    const { jobs, query } = req.body;
    if (!jobs || !query) {
      return res.status(400).json({ error: 'Jobs data and query are required.' });
    }
    
    const keptIds = await smartFilterJobs(jobs, query);
    res.json({ keptIds });
  } catch (error) {
    console.error('AI filter-jobs error:', error);
    res.status(500).json({ error: 'Failed to filter jobs.' });
  }
});

// POST /api/ai/chat
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    const result = await chatAssistant(message, context);
    res.json(result);
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI assistant failed.' });
  }
});

module.exports = router;
