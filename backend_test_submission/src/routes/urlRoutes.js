const express = require('express');
const UrlController = require('../controllers/UrlController');

const router = express.Router();

router.post('/shorturls', UrlController.createShortUrl);
router.get('/shorturls/:shortcode', UrlController.getStatistics);
router.get('/:shortcode', UrlController.redirectToOriginal);

module.exports = router;