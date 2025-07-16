require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  baseUrl: process.env.BASE_URL || 'http://localhost:3001',
  defaultValidityMinutes: parseInt(process.env.DEFAULT_VALIDITY_MINUTES) || 30,
  logging: {
    baseURL: process.env.LOG_BASE_URL,
    accessToken: process.env.ACCESS_TOKEN,
    tokenType: process.env.TOKEN_TYPE,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  }
};

module.exports = config;