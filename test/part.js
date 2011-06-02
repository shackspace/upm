/*!
 * Unit tests for /part and /parts API
 */

var Assert = require('assert');
var Async = require('async');
var Store = require('../lib/store');
var Part = require('../controller/part');

var log = {
  debug: console.log,
  error: console.error
};

var context = {
  store: {
    parts: Store.createStore({ name: 'parts' })
  }, 
  log: log
};
var part = Part.part(context);
var parts = Part.parts(context);

var headers = {
  'Content-Type': 'application/json'
};

exports['test /parts API'] = function (done) {
  context.store.parts.flush(function () {
      Assert.response(parts, {
          url: '/',
          timeout: 500
        }, {
          status: 200,
          body: '{}',
          headers: headers
        }, function () {
          done();
        });
    });
};

exports['get non existant part'] = function (done) {
  Assert.response(part, {
      url: '/IdontExist',
      timeout: 500
    }, {
      status: 404,
      headers: headers
    }, function () {
      done();
    });
};

exports['add new part and retrieve it'] = function (done) {
  Assert.response(part, {
      method: 'POST',
      url: '/',
      timeout: 500,
      headers: headers,
      data: JSON.stringify({ "name": "asdf12" })
    }, {
      body: /{"url":"\/part\/.*"}/,
      status: 200,
      headers: headers
    },
    function (res) {
      var partId = JSON.parse(res.body).url.replace('/part/', '');

      Assert.response(part, {
          url: '/' + partId,
          timeout: 500,
          headers: headers
        }, {
          status: 200,
          body: JSON.stringify({ "name": "asdf12" }),
          headers: headers
        }, function (res) {
          done();
        });

    });
};

exports['get non existant property'] = function (done) {
  Assert.response(part, {
      method: 'POST',
      url: '/',
      timeout: 500,
      headers: headers,
      data: JSON.stringify({ "name": "asdf12" })
    }, {
      body: /{"url":"\/part\/.*"}/,
      status: 200,
      headers: headers
    },
    function (res) {
      var partId = JSON.parse(res.body).url.replace('/part/', '');

      Assert.response(part, {
          url: '/' + partId + '/doesnotexist',
          timeout: 500,
          headers: headers
        }, {
          status: 404,
          headers: headers
        }, function (res) {
          done();
        });

    });
};

exports['add new properties to part'] = function (done) {
  var partData = { name: 'asdf12', hurr: 'dürr' };

  Async.waterfall([

      function createPart(callback) {
        Assert.response(part, {
            method: 'POST',
            url: '/',
            timeout: 500,
            headers: headers,
            data: JSON.stringify(partData)
          }, {
            status: 200,
            body: /{"url":"\/part\/.*"}/,
            headers: headers
          },
          function (res) {
            var partId = JSON.parse(res.body).url.replace('/part/', '');
            callback(null, partId);
          });
      },

      function setPartProperty(partId, callback) {
        Assert.response(part, {
            method: 'PUT',
            url: '/' + partId + '/newprop',
            timeout: 500,
            data: JSON.stringify({ "value": "asdf1234" }),
            headers: headers
          }, {
            status: 200,
            headers: headers
          }, function (res) {
            callback(null, partId);
          });
      },

      function getNewProperty(partId, callback) {
        Assert.response(part, {
            url: '/' + partId + '/newprop',
            timeout: 500
          }, {
            status: 200,
            body: JSON.stringify({ "value": "asdf1234" }),
            headers: headers
          }, function (res) {
            callback(null, partId);
          });
      },

      function validatePart(partId, callback) {
        Assert.response(part, {
            url: '/' + partId,
            timeout: 500
          }, {
            status: 200,
            headers: headers
          }, function (res) {
            partData.newprop = 'asdf1234';
            Assert.deepEqual(JSON.parse(res.body), partData);
            callback();
          });
      }
    ], function () {
      done();
    });
};

exports['teardown'] = function (done) {
  context.store.parts.quit();
  done();
};
