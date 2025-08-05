const express = require('express');
const router = express.Router();
const onlyController = require('../controllers/onlyController');

// episodes route
router.get('/', onlyController.getAllEpisodes);

// test route to make sure it is working
router.get('/test', (req, res) => {
  console.log('/episodes/test route hit');
  res.send('episodes router is working');
});

module.exports = router;
