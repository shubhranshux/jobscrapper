const express = require('express');
const multer = require('multer');
const db = require('../db/connection');
const auth = require('../middleware/auth');
const { uploadToS3, deleteFromS3, getSignedImageUrl } = require('../services/s3Service');

const router = express.Router();

// Helper: attach signed URL to a profile object
async function attachSignedUrl(profile) {
  if (profile && profile.profile_image_url) {
    profile.profile_image_url = await getSignedImageUrl(profile.profile_image_url);
  }
  return profile;
}

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed.'));
    }
  }
});

// GET /api/profile - Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, phone, skills, bio, profile_image_url, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );
    const profile = result.rows[0];

    if (!profile) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await attachSignedUrl(profile);
    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// PUT /api/profile - Update profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, phone, skills, bio } = req.body;

    await db.query(
      `UPDATE users SET 
       name = COALESCE($1, name), 
       phone = COALESCE($2, phone),
       skills = COALESCE($3, skills), 
       bio = COALESCE($4, bio), 
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [name, phone, skills, bio, req.user.id]
    );

    const result = await db.query(
      'SELECT id, name, email, phone, skills, bio, profile_image_url, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );
    const profile = result.rows[0];

    if (!profile) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await attachSignedUrl(profile);
    res.json({ message: 'Profile updated.', profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// POST /api/profile/image - Upload profile image
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    // Check if user has existing image to delete
    const existingResult = await db.query(
      'SELECT profile_image_url FROM users WHERE id = $1',
      [req.user.id]
    );
    const existingUser = existingResult.rows[0];

    if (existingUser?.profile_image_url) {
      await deleteFromS3(existingUser.profile_image_url);
    }

    // Upload new image to S3 — returns the S3 key
    const s3Key = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    // Store the S3 key in the database
    await db.query(
      'UPDATE users SET profile_image_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [s3Key, req.user.id]
    );

    // Return a signed URL to the frontend
    const signedUrl = await getSignedImageUrl(s3Key);
    res.json({ message: 'Profile image uploaded.', profile_image_url: signedUrl });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Failed to upload image.' });
  }
});

// DELETE /api/profile/image - Delete profile image
router.delete('/image', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT profile_image_url FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = result.rows[0];

    if (user?.profile_image_url) {
      await deleteFromS3(user.profile_image_url);
    }

    await db.query(
      'UPDATE users SET profile_image_url = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [req.user.id]
    );

    res.json({ message: 'Profile image deleted.' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image.' });
  }
});

module.exports = router;
