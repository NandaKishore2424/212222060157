import Logger from '../lib/Logger';

const config = {
  baseURL: 'http://20.244.56.144/evaluation-service',
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJuYW5kYWtpc2hvcmVyLnN0dWRlbnRAc2F2ZWV0aGEuYWMuaW4iLCJleHAiOjE3NTI2NTc2MTIsImlhdCI6MTc1MjY1NjcxMiwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImE3ODg1NmIwLTE5MWUtNGVmMi05NTc3LTBlN2MzZWY5ZjNlNSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im5hbmRhIGtpc2hvcmUgciIsInN1YiI6ImE2NTZiZjA1LWY2MGUtNDRiNS1hMDUwLWFiNDg2YjY0NjIzMSJ9LCJlbWFpbCI6Im5hbmRha2lzaG9yZXIuc3R1ZGVudEBzYXZlZXRoYS5hYy5pbiIsIm5hbWUiOiJuYW5kYSBraXNob3JlIHIiLCJyb2xsTm8iOiIyMTIyMjIwNjAxNTciLCJhY2Nlc3NDb2RlIjoicWd1Q2ZmIiwiY2xpZW50SUQiOiJhNjU2YmYwNS1mNjBlLTQ0YjUtYTA1MC1hYjQ4NmI2NDYyMzEiLCJjbGllbnRTZWNyZXQiOiJzVkNYZkhmUnh0SHJ5UFNnIn0._WUO5vHrVDShb27b6Cs5hXZfdpN5y8PobiuWdhp8UGk',
  tokenType: 'Bearer'
};

const logger = new Logger(config);

class AppLogger {
  static async info(packageName, message) {
    try {
      await logger.info('frontend', packageName, message);
    } catch (error) {
      console.error('Logging failed:', error.message);
    }
  }

  static async warn(packageName, message) {
    try {
      await logger.warn('frontend', packageName, message);
    } catch (error) {
      console.error('Logging failed:', error.message);
    }
  }

  static async error(packageName, message) {
    try {
      await logger.error('frontend', packageName, message);
    } catch (error) {
      console.error('Logging failed:', error.message);
    }
  }

  static async debug(packageName, message) {
    try {
      await logger.debug('frontend', packageName, message);
    } catch (error) {
      console.error('Logging failed:', error.message);
    }
  }
}

export default AppLogger;