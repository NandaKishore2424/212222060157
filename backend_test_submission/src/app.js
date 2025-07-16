const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const urlRoutes = require('./routes/urlRoutes');
const requestLogger = require('./middleware/requestLogger');
const AppLogger = require('./utils/logger');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/health', async (req, res) => {
  await AppLogger.info('route', 'health check endpoint is accessed');
  res.json({ 
    status: 'OK', 
    message: 'URL Shortener Service is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/', urlRoutes);

app.use('*', async (req, res) => {
  await AppLogger.warn('route', `route not found: ${req.originalUrl}`);
  res.status(404).json({
    error: 'Route is not found',
    message: 'The endpoint you asked for is not existinng'
  });
});

module.exports = app;