const express = require('express');
const UrlController = require('../controllers/UrlController');

const router = express.Router();

router.post('/', UrlController.createShortUrl);
router.get('/:shortcode', UrlController.getStatistics);


module.exports = router;