/*!
 * Unit test for storage engine
 */

var Store = require('../lib/store');
var Assert = require('assert');
var Async = require('async');

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

var log = {
  debug: console.log,
  error: console.error
};

exports['test data storage'] = function (beforeExit) {
  var callbacks = 0;
  var db = Store.createStore({ name: 'testdb',  log: log });
  db.flush(function () {

      var t1 = { hello: 123, world: 'asaa' };
      var t2 = { hello: 345, wooooo: 'asassas' };

      db.put('test1', t1, function (err) {
          callbacks += 1;
          Assert.deepEqual(null, err);
        });

      db.put('test2', t2, function (err) {
          callbacks += 1;
          Assert.deepEqual(null, err);
        });

      db.get('test1', function (err, val) {
          callbacks += 1;
          Assert.deepEqual(null, err);
          Assert.deepEqual(val, t1);
        });

      db.get('test2', function (err, val) {
          callbacks += 1;
          Assert.deepEqual(null, err);
          Assert.deepEqual(val, t2);
        });

      db.del('test2', function (err) {
          callbacks += 1;
          Assert.deepEqual(null, err);
        });

      db.get('test1', function (err, val) {
          callbacks += 1;
          Assert.ok(val);
        });

      db.get('test2', function (err, val) {
          callbacks += 1;
          Assert.deepEqual(null, val);
          db.quit();
        });

    });

  beforeExit(function () {
      Assert.strictEqual(callbacks, 7);
    });
};

exports['test all'] = function (beforeExit) {
  var callbacks = 0;
  var db = Store.createStore({ name: 'test2db',  log: log });
  db.flush(function () {
      var count = 0;

      Async.forEach(testData, function (entry, cb) {
          db.put('testNo' + count, entry, cb); 
          count += 1;
        }, function (err) {
          callbacks += 1;

          db.all(function (err, data) {
              callbacks += 1;
              Assert.ok(data);

              Object.keys(data).forEach(function (key) {
                  var index = Number(key.replace('testNo', ''));
                  Assert.deepEqual(data[key], testData[index]);
                });

              db.quit();
            });

        });

    });

  beforeExit(function () {
      Assert.strictEqual(callbacks, 2);
    });
};

exports['test flush'] = function (beforeExit) {
  var callbacks = 0;
  var count = 0;
  var db = Store.createStore({ name: 'test3db',  log: log });

  Async.series([
      function setTestValues(callback) {
        Async.forEach(testData, function (entry, cb) {
            db.put('testNo' + count, entry, cb); 
            count += 1;
          },
          function finished(err) {
            callbacks += 1;
            callback();
          });
      },

      function flushValues(callback) {
        db.flush(callback);
      },

      function checkFlush(callback) {
        db.all(function (err, data) {
            callbacks += 1;
            Assert.ok(data);
            Assert.deepEqual(data, {});
            callback();
          });
      }
    ],

    function closeDb(err) {
      db.quit();
    });


  beforeExit(function () {
      Assert.strictEqual(callbacks, 2);
    });

};
