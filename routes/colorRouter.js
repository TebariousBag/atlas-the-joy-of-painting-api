const express = require('express');
const router = express.Router();
const onlyController = require('../controllers/onlyController');

/**
 * Color Routes
 * 
 * Provides endpoints for retrieving paint color data
 */

// GET /colors - Retrieve all paint colors used in the show
router.get('/', onlyController.getAllColors);

module.exports = router;
