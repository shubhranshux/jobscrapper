const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files from local storage
app.use('/uploads', express.static(path.join(__dirname, 'data', 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const profileRoutes = require('./routes/profile');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai', aiRoutes);

// Location search API (no auth required for autocomplete speed)
const { searchLocationsAPI } = require('./services/locations');
app.get('/api/locations/search', async (req, res) => {
  try {
    const { q, limit } = req.query;
    const results = await searchLocationsAPI(q || '', parseInt(limit) || 8);
    res.json({ locations: results.map(r => r.name) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    storage: 'PostgreSQL (Neon) + AWS S3'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 JobScrapper API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Storage: PostgreSQL (Neon) + AWS S3\n`);
});

module.exports = app;
