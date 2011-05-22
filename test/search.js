/*!
 * Unit tests for /search api
 */

var Assert = require('assert');
var Search = require('../lib/search');
var search = Search.search({log : { debug : function () {} }});

var headers = {
  //'Content-Type': 'application/json'
};


exports['Search fulltext parts for nothing, retrieve nothing'] = function (beforeExit) {
  Assert.response(search, {
      url: '/parts?fulltext=',
      timeout: 500
    }, {
      body: '{}',
      status: 200,
      headers: headers
    });

};

exports['Search fulltext parts for nonexistent entry'] = function (beforeExit) {

  Assert.response(search, {
      url: '/parts?fulltext=IWillNeverExistInTheWholeLifetimeofThisProjectFuckYeah',
      timeout: 500
    }, {
      body: '{}',
      status: 200,
      headers: headers
    });

};

exports['Search fulltext parts'] = function (beforeExit) {

  Assert.response(search, {
      url: '/parts?fulltext=Search%20with%20whitespace,%20still%20receive%20nothing',
      timeout: 500
    }, {
      body: '{}',
      status: 200,
      headers: headers
    });
};

