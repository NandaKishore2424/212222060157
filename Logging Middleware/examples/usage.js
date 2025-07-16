const { Logger } = require('../src/index');
const config = require('../src/config');

async function runTest() {
  const logger = new Logger(config);
  
  try {
    await logger.info('backend', 'handler', 'User login attempt started');
    
    await logger.warn('backend', 'db', 'Query taking longer than expected');
    
    await logger.error('backend', 'handler', 'Login failed - invalid password');
    
    console.log('Test run completed');
    
  } catch (error) {
    console.error('Something went wrong:', error.message);
  }
}
runTest();