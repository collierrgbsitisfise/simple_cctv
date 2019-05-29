const { exec } = require("child_process");

class SystemMonitor {
  constructor() {}

  getRAMInfo() {
    return new Promise((res, _) => {
      exec("free -m", (err, stdout, stderr) => {
        res(stdout);
      });
    });
  }
}

module.exports.SystemMonitor = SystemMonitor;
