const moment = require('moment');
const { nanoid } = require('nanoid');

class UrlModel {
  constructor() {
    this.urls = new Map();
    this.clicks = new Map();
  }

  isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (err) {
      return false;
    }
  }

  generateShortcode() {
    return nanoid(6);
  }

  isValidShortcode(shortcode) {
    if (!shortcode || shortcode.length < 3 || shortcode.length > 10) {
      return false;
    }
    return /^[a-zA-Z0-9]+$/.test(shortcode);
  }

  shortcodeExists(shortcode) {
    return this.urls.has(shortcode);
  }

  createUrl(originalUrl, validityMinutes, customShortcode = null) {
    const now = moment();
    const expiry = now.clone().add(validityMinutes, 'minutes');
    
    let shortcode = customShortcode;
    if (!shortcode) {
      do {
        shortcode = this.generateShortcode();
      } while (this.shortcodeExists(shortcode));
    } else if (this.shortcodeExists(shortcode)) {
      throw new Error('Shortcode already exists');
    }

    const urlData = {
      id: shortcode,
      originalUrl: originalUrl,
      shortcode: shortcode,
      createdAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      clickCount: 0,
      isActive: true
    };

    this.urls.set(shortcode, urlData);
    this.clicks.set(shortcode, []);

    return urlData;
  }

  getUrl(shortcode) {
    return this.urls.get(shortcode);
  }

  isExpired(urlData) {
    if (!urlData) return true;
    return moment().isAfter(moment(urlData.expiresAt));
  }

  recordClick(shortcode, clickData) {
    const urlData = this.urls.get(shortcode);
    if (!urlData) return false;

    urlData.clickCount += 1;
    this.urls.set(shortcode, urlData);

    const clicks = this.clicks.get(shortcode) || [];
    clicks.push({
      timestamp: moment().toISOString(),
      referrer: clickData.referrer || 'direct',
      userAgent: clickData.userAgent || 'unknown',
      ipAddress: clickData.ipAddress || 'unknown',
      location: this.getLocationFromIP(clickData.ipAddress)
    });
    this.clicks.set(shortcode, clicks);

    return true;
  }

  getLocationFromIP(ipAddress) {
    const locations = ['New York, US', 'London, UK', 'Tokyo, JP', 'Mumbai, IN', 'Sydney, AU'];
    return locations[Math.floor(Math.random() * locations.length)];
  }

  getStatistics(shortcode) {
    const urlData = this.urls.get(shortcode);
    if (!urlData) return null;

    const clicks = this.clicks.get(shortcode) || [];

    return {
      shortcode: urlData.shortcode,
      originalUrl: urlData.originalUrl,
      createdAt: urlData.createdAt,
      expiresAt: urlData.expiresAt,
      totalClicks: urlData.clickCount,
      isActive: !this.isExpired(urlData),
      clickHistory: clicks
    };
  }
}

module.exports = new UrlModel();