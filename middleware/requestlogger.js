var Util = require('util');

var defaultLogger = {
  debug: console.log
};

module.exports = function (log) {
  log = log || defaultLogger; 

  return function (req, res, next) {
    var data = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.rawBody
    };

    log.debug(Util.inspect(data));

    next();
  };
};
