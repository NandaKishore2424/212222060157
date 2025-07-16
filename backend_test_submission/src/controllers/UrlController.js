const UrlModel = require('../models/UrlModel');
const config = require('../config');
const AppLogger = require('../utils/logger');

class UrlController {
  async createShortUrl(req, res) {
    try {
      const { url, validity, shortcode } = req.body;

      await AppLogger.info('controller', `Creating short URL for: ${url}`);

      if (!url) {
        await AppLogger.error('controller', 'URL field is required');
        return res.status(400).json({
          error: 'URL is required',
          message: 'Please provide a valid URL'
        });
      }

      if (!UrlModel.isValidUrl(url)) {
        await AppLogger.error('controller', `Invalid URL format: ${url}`);
        return res.status(400).json({
          error: 'Invalid URL format',
          message: 'Please provide a valid HTTP or HTTPS URL'
        });
      }

      const validityMinutes = validity || config.defaultValidityMinutes;

      if (shortcode && !UrlModel.isValidShortcode(shortcode)) {
        await AppLogger.error('controller', `Invalid shortcode format: ${shortcode}`);
        return res.status(400).json({
          error: 'Invalid shortcode',
          message: 'Shortcode must be 3-10 alphanumeric characters'
        });
      }

      if (shortcode && UrlModel.shortcodeExists(shortcode)) {
        await AppLogger.error('controller', `Shortcode already exists: ${shortcode}`);
        return res.status(409).json({
          error: 'Shortcode conflict',
          message: 'The provided shortcode is already in use'
        });
      }

      const urlData = UrlModel.createUrl(url, validityMinutes, shortcode);
      
      const response = {
        shortLink: `${config.baseUrl}/${urlData.shortcode}`,
        expiry: urlData.expiresAt
      };

      await AppLogger.info('controller', `Short URL created successfully: ${urlData.shortcode}`);

      res.status(201).json(response);

    } catch (error) {
      await AppLogger.error('controller', `Error creating short URL: ${error.message}`);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create short URL'
      });
    }
  }

  async getStatistics(req, res) {
    try {
      const { shortcode } = req.params;

      await AppLogger.info('controller', `Getting statistics for shortcode: ${shortcode}`);

      const stats = UrlModel.getStatistics(shortcode);

      if (!stats) {
        await AppLogger.warn('controller', `Shortcode not found: ${shortcode}`);
        return res.status(404).json({
          error: 'Shortcode not found',
          message: 'The requested shortcode does not exist'
        });
      }

      await AppLogger.info('controller', `Statistics retrieved for shortcode: ${shortcode}`);

      res.status(200).json(stats);

    } catch (error) {
      await AppLogger.error('controller', `Error getting statistics: ${error.message}`);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve statistics'
      });
    }
  }

  async redirectToOriginal(req, res) {
    try {
      const { shortcode } = req.params;

      // Add validation here
      if (!shortcode || !/^[a-zA-Z0-9]+$/.test(shortcode)) {
        await AppLogger.warn('handler', `Invalid shortcode format: ${shortcode}`);
        return res.status(400).json({
          error: 'Invalid shortcode format',
          message: 'Shortcode must contain only alphanumeric characters'
        });
      }

      await AppLogger.info('handler', `Redirect request for shortcode: ${shortcode}`);

      const urlData = UrlModel.getUrl(shortcode);

      if (!urlData) {
        await AppLogger.warn('handler', `Shortcode not found for redirect: ${shortcode}`);
        return res.status(404).json({
          error: 'Shortcode not found',
          message: 'The requested short URL does not exist'
        });
      }

      if (UrlModel.isExpired(urlData)) {
        await AppLogger.warn('handler', `Expired shortcode accessed: ${shortcode}`);
        return res.status(410).json({
          error: 'Link expired',
          message: 'This short URL has expired'
        });
      }

      const clickData = {
        referrer: req.get('Referrer'),
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip || req.connection.remoteAddress
      };

      UrlModel.recordClick(shortcode, clickData);

      await AppLogger.info('handler', `Successful redirect for shortcode: ${shortcode} to ${urlData.originalUrl}`);

      res.redirect(302, urlData.originalUrl);

    } catch (error) {
      await AppLogger.error('handler', `Error processing redirect: ${error.message}`);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to process redirect'
      });
    }
  }
}

module.exports = new UrlController();