const AppLogger = require('../utils/logger');

const requestLogger = async (req, res, next) => {
  const start = Date.now();
  
  await AppLogger.info('middleware', `${req.method} ${req.originalUrl} - Started`);
  
  res.on('finish', async () => {
    const duration = Date.now() - start;
    await AppLogger.info('middleware', `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = requestLogger;