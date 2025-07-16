require('dotenv').config();
const config = {
  baseURL: process.env.LOG_BASE_URL || 'http://20.244.56.144/evaluation-service',
  accessToken: process.env.ACCESS_TOKEN,
  tokenType: process.env.TOKEN_TYPE || 'Bearer',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
};
module.exports = config;