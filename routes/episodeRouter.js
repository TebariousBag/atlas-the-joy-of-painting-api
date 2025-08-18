const express = require('express');
const router = express.Router();
const onlyController = require('../controllers/onlyController');

/**
 * Episode Routes
 * 
 * Provides endpoints for retrieving episode data with filtering capabilities
 */

// GET /episodes - Retrieve all episodes with optional filtering
router.get('/', onlyController.getAllEpisodes);

// GET /episodes/test - Test endpoint for router verification
router.get('/test', (req, res) => {
  console.log('/episodes/test route hit');
  res.json({
    message: 'Episodes router is working correctly',
    endpoint: '/episodes/test',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
