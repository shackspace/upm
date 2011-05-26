/*!
 * Unit test for storage engine
 */

var Store = require('../lib/store');
var Assert = require('assert');

var testData = [
  { a: 23, b: 'foo', c: true },
  { a: 12, b: 'zzz', c: false },
  { a: 100, b: 'foo', c: true },
  { a: 9, b: 'aaa', c: true },
  { a: 1, b: 'foo', c: true },
  { a: 55, b: 'foo', c: false },
  { a: 0, b: 'asdf', c: true },
  { a: 13, b: 'foo', c: true },
  { a: 11, b: 'foo', c: false },
  { a: 2, b: 'foo', c: true },
  { a: 524252, b: 'qwerty', c: false },
  { a: 111, b: 'foo', c: true },
  { a: 55, b: 'foo', c: true },
];

exports['test data storage'] = function (beforeExit) {
  var callbacks = 0;
  var db = Store.createStore({ name: 'testdb' });

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

  db.get('test1', function (err, val) {
      callbacks += 1;
      Assert.ok(val);
    });

  db.get('test2', function (err, val) {
      callbacks += 1;
      Assert.ok(err);
    });

  beforeExit(function () {
      Assert.strictEqual(callbacks, 7);
    });
};


exports['test data filtering'] = function (beforeExit) {
  var callbacks = 0;
  var db = Store.createStore({ name: 'testdb' });

  db.filter(function (key, value) {
      return (value.c);
    }, function (err, data) {
    });
};
