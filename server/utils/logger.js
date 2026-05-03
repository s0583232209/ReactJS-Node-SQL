// import SimpleNodeLogger from 'simple-node-logger';

// const log = SimpleNodeLogger.createSimpleLogger({
//   logFilePath: './logs/app.log',
//   timestampFormat: 'YYYY-MM-DD HH:mm:ss'
// });

// log.setLevel('info');
// log.info('init log')
// export default log;
import util from 'util';
import fs from 'fs';

// Patch removed util method back in for simple-node-logger compatibility
if (!util.isDate) {
  util.isDate = (obj) => obj instanceof Date;
  
}

import SimpleNodeLogger from 'simple-node-logger';

fs.mkdirSync('logs', { recursive: true });

const log = SimpleNodeLogger.createSimpleLogger({
  logFilePath: 'logs/app.log',
  timestampFormat: 'YYYY-MM-DD HH:mm:ss'
});

log.setLevel('info');
log.info('init')
export default log;