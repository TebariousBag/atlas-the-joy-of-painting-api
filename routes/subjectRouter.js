const express = require('express');
const router = express.Router();
const onlyController = require('../controllers/onlyController');

// all endpoints go here
// just trying to figure out how to connect everything
router.get('/', onlyController.getAllSubjects);

module.exports = router;
