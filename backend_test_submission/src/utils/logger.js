const { Logger } = require('../../../Logging Middleware/src/index');
const fs = require('fs');
const path = require('path');

const config = {
  baseURL: 'http://20.244.56.144/evaluation-service',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYW5kYWtpc2hvcmVyLnN0dWRlbnRAc2F2ZWV0aGEuYWMuaW4iLCJleHAiOjE3NTI2NTc2MTIsImlhdCI6MTc1MjY1NjcxMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImE3ODg1NmIwLTE5MWUtNGVmMi05NTc3LTBlN2MzZWY5ZjNlNSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im5hbmRhIGtpc2hvcmUgciIsInN1YiI6ImE2NTZiZjA1LWY2MGUtNDRiNS1hMDUwLWFiNDg2YjY0NjIzMSJ9LCJlbWFpbCI6Im5hbmRha2lzaG9yZXIuc3R1ZGVudEBzYXZlZXRoYS5hYy5pbiIsIm5hbWUiOiJuYW5kYSBraXNob3JlIHIiLCJyb2xsTm8iOiIyMTIyMjIwNjAxNTciLCJhY2Nlc3NDb2RlIjoicWd1Q2ZmIiwiY2xpZW50SUQiOiJhNjU2YmYwNS1mNjBlLTQ0YjUtYTA1MC1hYjQ4NmI2NDYyMzEiLCJjbGllbnRTZWNyZXQiOiJzVkNYZkhmUnh0SHJ5UFNnIn0._WUO5vHrVDShb27b6Cs5hXZfdpN5y8PobiuWdhp8UGk',
  tokenType: 'Bearer'
};

let logger;
try {
  logger = new Logger(config);
} catch (error) {
  console.error('Failed to initialize logger:', error.message);
}

const logToFile = (level, packageName, message) => {
  const timestamp = new Date().toISOString();
  const logDir = path.join(__dirname, '../../logs');
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logFile = path.join(logDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] [${packageName}] ${message}\n`;
  
  fs.appendFileSync(logFile, logMessage);
  console.log(`[${level.toUpperCase()}] [${packageName}] ${message}`);
};

class AppLogger {
  static async info(packageName, message) {
    try {
      if (logger) {
        await logger.info('backend', packageName, message);
      } else {
        logToFile('info', packageName, message);
      }
    } catch (error) {
      logToFile('info', packageName, message);
      console.error('Remote logging failed, using local log file instead');
    }
  }

  static async warn(packageName, message) {
    try {
      if (logger) {
        await logger.warn('backend', packageName, message);
      } else {
        logToFile('warn', packageName, message);
      }
    } catch (error) {
      logToFile('warn', packageName, message);
    }
  }

  static async error(packageName, message) {
    try {
      if (logger) {
        await logger.error('backend', packageName, message);
      } else {
        logToFile('error', packageName, message);
      }
    } catch (error) {
      logToFile('error', packageName, message);
    }
  }

  static async fatal(packageName, message) {
    try {
      if (logger) {
        await logger.fatal('backend', packageName, message);
      } else {
        logToFile('fatal', packageName, message);
      }
    } catch (error) {
      logToFile('fatal', packageName, message);
    }
  }
}

module.exports = AppLogger;
