
exports.createStore = function createStore(context) {

  var store = {};
  var def = function() { };

  function all(cb) {
    cb(null, store);
  }

  function get(key, cb) {
    if (key in store) {
      cb(null, store[key]);
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
        if (filterFunc(key, store[key])) {
          filtered[key] = val;
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
