var config = require("../config");
var hostsRequire = require(`./${config.hostsFile}`);
module.exports.frontServer = hostsRequire.frontServer;
module.exports.userServer = hostsRequire.userServer;
module.exports.opsServer = hostsRequire.opsServer;
module.exports.webServer = hostsRequire.webServer;
