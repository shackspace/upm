
exports.createStore = function createStore(context, callback) {

  var db = require('dirty')(context.fileName);

  db.on('load', function () {

      function get(key, cb) {
        cb(null, db.get(key));
      }

      function put(key, value, cb) {
        db.set(key, value, function (err) {
            cb(err)
          });
      }

      function del(key, cb) {
        db.rm(key, function (err) {
            cb(err);
          });
      }

      function filter(filterFunc, cb) {
        var filtered = {};

        db.forEach(function(key, val) {
            if (filterFunc(key, val)) {
              filtered[key] = val;
            }
          });
        cb(null, filtered);
      }

      callback({
          get: get,
          put: put,
          del: del,
          all: all
        });

    });

  db.on('drain', function () {
      context.log.debug('All records are saved on disk now.');
    });

};
