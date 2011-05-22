/*!
 *
 * upm main app
 *
 */

var Util = require('util');
var Fs = require('fs');
var Connect = require('connect');

var Parts = require('./lib/parts');

var log4js = require('log4js')();
var errorlog = log4js.getLogger('errorlog');

errorlog.setLevel('ERROR');
log4js.addAppender(log4js.fileAppender(__dirname + '/log/upm.log'));
log4js.addAppender(log4js.fileAppender(__dirname + '/log/error.log'), errorlog);

var log = log4js.getLogger('reboard');
log.setLevel('DEBUG');

/*
 * register error handler for uncaught exceptions
 */
process.on('uncaughtException', function (err) {
    errorlog.error(err.stack);
  });

var logStream = Fs.createWriteStream(__dirname + '/log/access.log', {
    encoding: 'utf-8',
    flags: 'a'
  });

var server = Connect.createServer(
  Connect.bodyParser(),
  Connect.logger({ stream: logStream }),
  Connect.errorHandler({showStack: true, dumpExceptions: true})
);

server.use('/parts', Parts.create());

server.listen(31337, function () {
    log.info('UPM successfully listening on http://localhost:31337/');
  });
