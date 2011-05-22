/*!
 * Unit tests for /part and /parts API
 */

var Assert = require('assert');
var Part = require('../lib/part');

var headers = {
  'Content-Type': 'application/json'
};


exports['test /parts API'] = function (beforeExit) {

  Assert.response(Part.parts(), {
      url: '/', timeout: 500
    }, {
      body: '{}',
      status: 200,
      headers: headers
    });

};

exports['get non existant part'] = function (beforeExit) {

  Assert.response(Part.part(), {
      url: '/IdontExist', timeout: 500
    }, {
      body: JSON.stringify({ "message": "not found" }),
      status: 404,
      headers: headers
    });
};

exports['add new part and retrieve it'] = function (beforeExit) {
  var part = Part.part();

  Assert.response(part, {
      url: '/', timeout: 500,
      method: 'POST',
      headers: headers,
      data: '{ "name": "asdf12" }'
    }, {
      body: JSON.stringify({ "url": "/part/asdf12" }),
      status: 200,
      headers: headers
    });

  Assert.response(part, {
      url: '/asdf12', timeout: 500,
      headers: headers
    }, {
      body: JSON.stringify({ "name": "asdf12" }),
      status: 200,
      headers: headers
    });

};

exports['add new properties to part'] = function (beforeExit) {
});
