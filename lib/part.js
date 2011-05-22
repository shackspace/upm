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

var store = {};

exports.parts = function (server) {
  return Connect(
    Quip(),
    Connect.router(function (app) {

        app.get('/', function(req, res){
            res.ok().json(store);
          });

      })
  );
};

exports.part = function (server) {
  return Connect(
    Quip(),
    Connect.bodyParser(),
    Connect.router(function (app) {

        app.post('/', function (req, res) {
            store[req.body.name] = req.body;
            res.ok().json({ url: '/part/' + req.body.name });
          });

        app.get('/:id', function (req, res) {
            console.dir(store);

            if (store[req.params.id]) {
              res.ok().json(store[req.params.id]);
            } else {
              res.notFound().json({ message: 'not found'});
            }

          });

        app.get('/:id/:property', function (req, res) {
            res.end('Return property ' + req.params.property + ' of ' + req.params.id);
          });

        app.put('/:id/:property', function (req, res) {
            res.end('Update/create property ' + req.params.property + ' of ' + req.params.id);
          });


      })
  );
};

