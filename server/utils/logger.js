import fs from 'fs';
import path from 'path';

class Logger {
  constructor(logFilePath) {
    this.logFilePath = logFilePath;
    const logDir = path.dirname(logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const dataStr = data ? ' ' + JSON.stringify(data) : '';
    return `${timestamp} [${level}] ${message}${dataStr}\n`;
  }

  log(level, message, data) {
    const logMessage = this.formatMessage(level, message, data);
    console.log(logMessage.trim());
    fs.appendFileSync(this.logFilePath, logMessage);
  }

  info(message, data) {
    this.log('INFO', message, data);
  }

  error(message, data) {
    this.log('ERROR', message, data);
  }

  warn(message, data) {
    this.log('WARN', message, data);
  }

  debug(message, data) {
    this.log('DEBUG', message, data);
  }
}

const log = new Logger('logs/app.log');

export default log;
