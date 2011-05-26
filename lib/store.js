
exports.createStore = function createStore(context) {

  var store = {};
  var def = function() { };

  function all(cb) {
    var data = JSON.parse(JSON.stringify(store));
    cb(null, data);
  }

  function get(key, cb) {
    if (key in store) {
      var data = JSON.parse(JSON.stringify(store[key]));
      cb(null, data);
    } else {
      cb(new Error('key does not exist'));
    }
  }

  function put(key, value, cb) {
    cb = cb || def;
    store[key] = value;
    cb(null);
  }

  function del(key, cb) {
    cb = cb || def;
    if (key in store) {
      delete store[key];
      cb(null);
    } else {
      cb(new Error('key does not exist'));
    }
  }

  function filter(filterFunc, cb) {
    cb = cb || def;
    var filtered = {};

    Object.keys(store).forEach(function (key) {
        var data = JSON.parse(JSON.stringify(store[key]));

        if (filterFunc(key, data)) {
          filtered[key] = data;
        }

      });

    cb(null, filtered);
  }

  return {
    get: get,
    put: put,
    del: del,
    all: all,
    filter: filter 
  };

};
