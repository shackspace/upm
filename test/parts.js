/*!
 * Unit tests for /part and /parts API
 */

var Assert = require('assert');
var Part = require('../lib/part');
var part = Part.part();
var parts = Part.parts();

var headers = {
  'Content-Type': 'application/json'
};

exports['test /parts API'] = function (beforeExit) {

  Assert.response(parts, {
      url: '/',
      timeout: 500
    }, {
      body: '{}',
      status: 200,
      headers: headers
    });

};

exports['get non existant part'] = function (beforeExit) {

  Assert.response(part, {
      url: '/IdontExist',
      timeout: 500
    }, {
      status: 404,
      headers: headers
    });
};

exports['add new part and retrieve it'] = function (beforeExit) {

  Assert.response(part, {
      method: 'POST',
      url: '/',
      timeout: 500,
      headers: headers,
      data: '{ "name": "asdf12" }'
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
          body: JSON.stringify({ "name": "asdf12" }),
          status: 200,
          headers: headers
        });
    });

};

exports['retrieve non existant part property'] = function (beforeExit) {
  Assert.response(part, {
      method: 'POST',
      url: '/',
      timeout: 500,
      headers: headers,
      data: '{ "name": "asdf12" }'
    }, {
      body: /{"url":"\/part\/.*"}/,
      status: 200,
      headers: headers
    },
    function (res) {
      var partId = JSON.parse(res.body).url.replace('/part/', '');

      Assert.response(part, {
          url: '/' + partId + '/nonexistantprop', timeout: 500,
          headers: headers
        }, {
          status: 404,
          headers: headers
        });

    });

};


exports['add new properties to part'] = function (beforeExit) {
  var partData = { name: 'asdf12', hurr: 'durr' };

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
    });

};
