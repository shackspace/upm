/*
 * # List all the parts
 - GET /parts
 ====> 200, parts by value
 ====> 404

 # Create or Update the threshold, when part should be re-ordered
 - PUT /part/42/threshold
 2
 ====> 200
 ====> 404 -- part does not exist

 # Create or Update amount to 666
 - PUT /part/42/amount
 666
 ====> 200
 ====> 404 -- part does not exist

 # Retrieve amount of a part
 - GET /part/42/amount
 ====> 200, 666
 ====> 404

 */

var Connect = require('connect');
var Quip = require('quip');
var Uuid = require('node-uuid');

var RequestLogger = require('../middleware/requestlogger');

var store = {};

exports.parts = function (server) {
  return Connect(
    Quip(),
    Connect.router(function (app) {

        app.get('/', function (req, res) {
            res.ok().json(store);
          });

      })
  );
};

exports.part = function (server) {
  return Connect(
    Quip(),
    Connect.bodyParser(),
   // RequestLogger(),
    Connect.router(function (app) {

        app.post('/', function (req, res) {
            var uuid = Uuid();
            store[uuid] = req.body;
            res.ok().json({ url: '/part/' + uuid });
          });

        app.get('/:id', function (req, res) {
            var par = req.params;

            if (store[par.id]) {
              res.ok().json(store[par.id]);
            } else {
              res.notFound().json({
                  message: 'No part with id ' + par.id + 'was found'
                });
            }

          });

        app.get('/:id/:property', function (req, res) {
            var par = req.params;

            if (store[par.id]) {
              if (store[par.id][par.property]) {
                res.ok().json({ value: store[par.id][par.property] });
              } else {
                res.notFound().json({
                    message: 'Part with id ' + par.id + ' has no attribute ' + par.property
                  });
              }
            } else {
              res.notFound().json({
                  message: 'No part with id ' + par.id + 'was found'
                });
            }
          });

        app.put('/:id/:property', function (req, res) {
            var par = req.params;

            if (store[par.id]) {
              store[par.id][par.property] = req.body.value;
              res.ok().json({ message: 'ok' });
            } else {
              res.notFound().json({
                  message: 'No part with id ' + par.id + 'was found'
                });
            }
          });

      })
  );
};

