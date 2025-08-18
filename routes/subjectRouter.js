const express = require('express');
const router = express.Router();
const onlyController = require('../controllers/onlyController');

/**
 * Subject Routes
 * 
 * Provides endpoints for retrieving painting subject data
 */

// GET /subjects - Retrieve all available painting subjects
router.get('/', onlyController.getAllSubjects);

module.exports = router;
