const app = require('./app');
const config = require('./config');
const AppLogger = require('./utils/logger');

const startServer = async () => {
  try {
    await AppLogger.info('service', 'Starting URL Shortener Service...');
    
    const server = app.listen(config.port, () => {
      AppLogger.info('service', `server running on port ${config.port}`);
      console.log(`the project is running on http://localhost:${config.port}`);
    });

    process.on('SIGTERM', async () => {
      await AppLogger.info('service', 'SIGTERM received, shutting down gracefully');
      server.close(() => {
        process.exit(0);
      });
    });

  } catch (error) {
    await AppLogger.fatal('service', `Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();