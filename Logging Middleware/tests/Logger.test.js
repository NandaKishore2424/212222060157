const Logger = require('../src/Logger');

describe('Logger tests', () => {
  test('basic logger creation works', () => {
    const logger = new Logger({ accessToken: 'test-123' });
    expect(logger.accessToken).toBe('test-123');
  });
  
  test('backend handler logging works', () => {
    const logger = new Logger();
    expect(() => {
      logger.validateInput('backend', 'error', 'handler');
    }).not.toThrow();
  });
  
  test('invalid stack throws error', () => {
    const logger = new Logger();
    expect(() => {
      logger.validateInput('mobile', 'info', 'handler');
    }).toThrow();
  });
});