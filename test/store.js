

var Store = require('../lib/store');
var Uuid = require('node-uuid');
var Assert = require('assert');

exports['test data storage'] = function (beforeExit) {
  var id = Uuid();
  var callbacks = 0;

  Store.createStore({ fileName: '/tmp/' + id + '.db'}, function (db) {
      var t1 = { hello: 123, world: 'asaa' };
      var t2 = { hello: 345, wooooo: 'asassas' };

      db.put('test1', t1, function () {
          callbacks += 1;
        });

      db.put('test2', t2, function () {
          callbacks += 1;
        });

      db.get('test1', function (err, val) {
          callbacks += 1;
          Assert.deepEqual(val, t1);
        });

      db.get('test2', function (err, val) {
          callbacks += 1;
          Assert.deepEqual(val, t2);
        });

      db.del('test2', function (err) {
          callbacks += 1;
        });
      
      db.get('test2', function (err, val) {
          callbacks += 1;
          Assert.ok(err);
        });


      beforeExit(function () {
          Assert.strictEqual(callbacks, 6);
        });
    });
};
