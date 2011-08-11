#!/usr/bin/env node

var Fs = require('fs');
var Wwwdude = require('wwwdude');
var Async = require('async');

var fileName = process.argv[2];
var data = JSON.parse(Fs.readFileSync(fileName));
var client = Wwwdude.createClient();

function createPart(part, callback) {
  console.log('Storing part ' + part);

  client.post('http://localhost:31337/part', {
      payload: JSON.stringify(part)
    })
  .on('success', function () {
      callback();
    })
  .on('http-error', function (data) {
      callback(data);
    });
}

Async.forEach(Object.keys(data), function (item, cb) {
    createPart(data[item], cb);
  }, function (err) {
    console.dir(err);
  });
