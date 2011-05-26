/*!
 * data store abstraction layer
 */


// Dependencies
var Redis = require('redis');
var Async = require('async');
var Util = require('util');

exports.createStore = function createStore(context) {
  var client = Redis.createClient();
  var name = context.name;

  client.on('error', function (err) {
      context.log.error(err.message);
    });


  function put(key, value, cb) {
    var data = JSON.stringify(value);
    client.set(name + '.' + key, data, cb);
  }

  function get(key, cb) {
    client.get(name + '.' + key, function (err, data) {
        if (err) {
          cb(err);
          return;
        }
        var value = JSON.parse(data);
        cb(null, value);
      });
  }

  function all(cb) {
    client.keys(name + '.*', function (err, keys) {
        Async.reduce(keys, {}, function (acc, key, reduceCb) {
            client.get(key, function (err, data) {
                if (err) {
                  reduceCb(err);
                } else {
                  acc[key.replace(name + '.', '')] = JSON.parse(data);
                  reduceCb(null, acc);
                }
              });

          }, function (err, all) {
            if (err) {
              cb(err);
            } else {
              cb(null, all);
            }
          });

      });
  }

  function del(key, cb) {
    client.del(name + '.' + key, cb);
  }

  function flush(cb) {
    client.keys(name + '.*', function (err, keys) {
        if (err) {
          cb(err);
        } else {
          client.del(keys, cb);
        }
      });
  }

  function filter(filterFunc, cb) {
  }

  function save() {
    // TODO: implement
  }

  function restore() {
    // TODO: implement
  }

  function quit() {
    client.quit();
  }

  return {
    get: get,
    put: put,
    del: del,
    all: all,
    save: save,
    restore: restore,
    filter: filter,
    flush: flush,
    quit: quit
  };

};
