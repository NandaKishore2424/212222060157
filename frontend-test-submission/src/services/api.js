import axios from 'axios';
import AppLogger from '../utils/logger';

const API_BASE_URL = 'http://localhost:3001';

const api = {
  shortenUrl: async (urlData) => {
    try {
      await AppLogger.info('api', `Shortening URL: ${urlData.url}`);
      const response = await axios.post(`${API_BASE_URL}/shorturls`, urlData);
      await AppLogger.info('api', `URL shortened successfully: ${response.data.shortLink}`);
      return response.data;
    } catch (error) {
      await AppLogger.error('api', `Error shortening URL: ${error.message}`);
      throw error;
    }
  },

  getUrlStatistics: async (shortcode) => {
    try {
      await AppLogger.info('api', `Fetching statistics for: ${shortcode}`);
      const response = await axios.get(`${API_BASE_URL}/shorturls/${shortcode}`);
      await AppLogger.info('api', `Statistics fetched successfully for: ${shortcode}`);
      return response.data;
    } catch (error) {
      await AppLogger.error('api', `Error fetching statistics: ${error.message}`);
      throw error;
    }
  }
};

export default api;