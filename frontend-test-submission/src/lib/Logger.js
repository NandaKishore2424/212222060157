import axios from 'axios';

class Logger {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'http://20.244.56.144/evaluation-service';
    this.accessToken = config.accessToken;
    this.tokenType = config.tokenType || 'Bearer';
    this.validStacks = ['backend', 'frontend'];
    this.validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
    this.validPackages = {
      backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
      frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
      both: ['auth', 'config', 'middleware', 'utils']
    };
  }
  
  validateInput(stack, level, packageName) {
    if (!stack || !level || !packageName) {
      throw new Error('Missing required parameters');
    }
    
    if (!this.validStacks.includes(stack)) {
      throw new Error(`Stack '${stack}' is not supported. Use backend or frontend.`);
    }
    
    if (!this.validLevels.includes(level)) {
      throw new Error(`Unknown log level: ${level}`);
    }
    
    this.checkPackageCompatibility(stack, packageName);
    return true;
  }

  checkPackageCompatibility(stack, packageName) {
    const backendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
    const frontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];
    const sharedPackages = ['auth', 'config', 'middleware', 'utils'];
    
    if (stack === 'backend' && frontendPackages.includes(packageName)) {
      throw new Error(`Package '${packageName}' cannot be used in backend`);
    }
    
    if (stack === 'frontend' && backendPackages.includes(packageName)) {
      throw new Error(`Package '${packageName}' is backend-only`);
    }
    
    const allPackages = [...backendPackages, ...frontendPackages, ...sharedPackages];
    if (!allPackages.includes(packageName)) {
      throw new Error(`Unknown package: ${packageName}`);
    }
  }

  async log(stack, level, packageName, message) {
    try {
      this.validateInput(stack, level, packageName);
      
      const logData = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: packageName.toLowerCase(),
        message: message
      };
      
      const requestConfig = {
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (this.accessToken) {
        requestConfig.headers.Authorization = `${this.tokenType} ${this.accessToken}`;
      }
      
      const response = await axios.post(`${this.baseURL}/logs`, logData, requestConfig);
      
      console.log(`[${level.toUpperCase()}] ${message} -> ${response.data.logID}`);
      
      return response.data;
      
    } catch (err) {
      console.error('Log failed:', err.message);
      if (err.response) {
        console.error('Server said:', err.response.data);
      }
      throw err;
    }
  }

  debug(stack, packageName, message) {
    return this.log(stack, 'debug', packageName, message);
  }

  info(stack, packageName, message) {
    return this.log(stack, 'info', packageName, message);
  }

  warn(stack, packageName, message) {
    return this.log(stack, 'warn', packageName, message);
  }

  error(stack, packageName, message) {
    return this.log(stack, 'error', packageName, message);
  }

  fatal(stack, packageName, message) {
    return this.log(stack, 'fatal', packageName, message);
  }
}

export default Logger;