const Logger = require('./Logger');
function createLogger(config) {
  return new Logger(config);
}
const Log = (stack, level, packageName, message, config = {}) => {
  const logger = new Logger(config);
  return logger.log(stack, level, packageName, message);
};
module.exports = {
  Logger,
  createLogger,
  Log
};