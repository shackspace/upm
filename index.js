/*!
 *
 * upm main app
 *
 */

var CONTROLLER_DIR = __dirname + '/controller';

var Util = require('util');
var Fs = require('fs');
var Connect = require('connect');
var Cluster = require('cluster');
var RequestLogger = require('./middleware/requestlogger');
var Store = require('./lib/store');

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

var requestStream = Fs.createWriteStream(__dirname + '/log/requests.log', {
    flags: 'a',
    encoding: 'utf-8'
  });

var server = Connect.createServer(
  Connect.bodyParser(),
  Connect.static(__dirname + '/public'),
  RequestLogger({ log: log, logStream: requestStream }),
  Connect.errorHandler({showStack: true, dumpExceptions: true})
);

var context = {
  log: log,
  store: {
    parts: Store.createStore({ name: 'parts', log: log }),
    carts: Store.createStore({ name: 'carts', log: log }),
    templates: Store.createStore({ name: 'templates', log: log })
  }
};

(function initModules() {
    Fs.readdirSync(CONTROLLER_DIR).forEach(function (file) {
        if (/\.js$/.test(file)) {
          var name = file.split('\.')[0];
          var module = require(CONTROLLER_DIR + '/' + name);
          Object.keys(module).forEach(function (route) {
              server.use('/' + route, module[route](context));
            });
        }   
      }); 
  }());


/*
Cluster(server)
.use(Cluster.pidfiles('pid'))
.use(Cluster.cli())
.use(Cluster.logger('log'))
.listen(31337);
*/

server.listen(31337);
