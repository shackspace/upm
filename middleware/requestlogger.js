/*!
 * connect middleware to log and persist HTTP requests
 *
 * @author pfleidi
 */

var Fs = require('fs');
var Util = require('util');

var defaultLogger = {
  debug: console.log,
  error: console.error
};

module.exports = function (context) {
  var log = context.log || defaultLogger; 
  var logStream = context.logStream;

  return function (req, res, next) {
    var data = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.rawBody
    };

    if (logStream) {
      var logData = JSON.stringify(data) + '\n';
      logStream.write(logData, function (err) {
          if (err) {
            log.error(err.toString());
          }
        });
    }

    log.debug(Util.inspect(data));

    next();
  };
};
