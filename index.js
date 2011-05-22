/*!
 *
 * upm main app
 *
 */

var CONTROLLER_DIR = __dirname + '/controller';

var Util = require('util');
var Fs = require('fs');
var Connect = require('connect');
var RequestLogger = require('./middleware/requestlogger');

var log4js = require('log4js')();
var errorlog = log4js.getLogger('errorlog');

errorlog.setLevel('ERROR');
log4js.addAppender(log4js.fileAppender(__dirname + '/log/upm.log'));
log4js.addAppender(log4js.fileAppender(__dirname + '/log/error.log'), errorlog);

var log = log4js.getLogger('upm');
log.setLevel('DEBUG');

/*
 * register error handler for uncaught exceptions
 */
process.on('uncaughtException', function (err) {
    errorlog.error(err.stack);
  });

var accessStream = Fs.createWriteStream(__dirname + '/log/access.log', {
    encoding: 'utf-8',
    flags: 'a'
  });

var requestStream = Fs.createWriteStream(__dirname + '/log/requests.log', {
    flags: 'a',
    encoding: 'utf-8'
  });

var server = Connect.createServer(
  Connect.bodyParser(),
  RequestLogger({ log: log, logStream: requestStream }),
  Connect.logger({ stream: accessStream }),
  Connect.errorHandler({showStack: true, dumpExceptions: true})
);

(function initModules() {
    Fs.readdirSync(CONTROLLER_DIR).forEach(function (file) {
        if (/\.js$/.test(file)) {
          var name = file.split('\.')[0];
          var module = require(CONTROLLER_DIR + '/' + name);
          Object.keys(module).forEach(function (route) {
              server.use('/' + route, module[route]({ log: log }));
            });
        }   
      }); 
  }());

server.listen(31337, function () {
    log.info('UPM successfully listening on http://localhost:31337/');
  });
