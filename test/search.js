/*!
 * Unit tests for /search api
 */
var parts = { '00000' : { 'penis' : '20inch', 'balls': 'made of steel' } ,
          '00001' : { 'penis' : 'tiny', 'balls' :'none' }, 
          '00002' : { 'vagina' : 'hairy', 'breast' :'fuckin huge!' },
          '00003' : { 'vagina' : 'shaved', 'breast' :'flat chest' }
}
var templates = { "shemale" :{ '00001' : '2000 [stueck]' , '00003' : '>9001 stueck' }, "doublepenisbob" : {"00000" : "2", "00001" : "1"} }


var Assert = require('assert');
var Search = require('../controller/search');
var search = Search.search({log : { debug : function () {} },
  store: { 
    parts : { 'all' : function () { return { err: 0,all : parts}}},
    templates: { 'all' : function () { return { err: 0,all: templates}}}}} );

var headers = {
  //'Content-Type': 'application/json'
};
// dummy data -> get these from the database backend
// end of dummy data


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

