import util from "util";
import fs from "fs";

// Patch removed util method back in for simple-node-logger compatibility
if (!util.isDate) {
  util.isDate = (obj) => obj instanceof Date;
}

import SimpleNodeLogger from "simple-node-logger";

fs.mkdirSync("logs", { recursive: true });
const opts = {
  logDirectory: "./logs",
  fileNamePattern: "app-<DATE>.log",
  dateFormat: "YYYY.MM.DD",
};
const log = SimpleNodeLogger.createRollingFileLogger(opts);

log.setLevel("info");
log.info("init");
export default log;
