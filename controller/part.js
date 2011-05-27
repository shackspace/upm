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

exports.parts = function (context) {
  var store = context.store.parts;

  return Connect(
    Quip(),
    Connect.router(function (app) {

        app.get('/', function (req, res) {
            store.all(function (err, data) {
                if (err) {
                  res.error().json({ message: err.stack });
                  return;
                }

                res.ok().json(data);
              });
          });

      })
  );
};

exports.part = function (context) {
  var store = context.store.parts;

  return Connect(
    Quip(),
    Connect.bodyParser(),
    Connect.router(function (app) {

        app.post('/', function (req, res) {
            var uuid = Uuid();
            store.put(uuid, req.body, function (err) {
                if (err) {
                  res.error().json({ message: err.stack });
                  return;
                }

                res.ok().json({ url: '/part/' + uuid });
              });
          });

        app.get('/:id', function (req, res) {
            var par = req.params;
            store.get(par.id, function (err, part) {
                if (part) {
                  res.ok().json(part);
                } else {
                  res.notFound().json({
                      message: 'No part with id ' + par.id + 'was found'
                    });
                }
              });
          });

        app.del('/:id', function (req, res) {
            var par = req.params;
            store.get(par.id, function (err, part) {
                if (part) {
                  store.del(par.id, function (err) {
                      res.ok().json({ message: 'ok' });
                    });
                } else {
                  res.notFound().json({
                      message: 'No part with id ' + par.id + ' was found'
                    });
                }
              });
          });

        app.get('/:id/:property', function (req, res) {
            var par = req.params;
            var part = store.get(par.id, function (err, part) {
                if (part) {
                  if (part[par.property]) {
                    res.ok().json({ value: part[par.property] });
                  } else {
                    res.notFound().json({
                        message: 'Part with id ' + par.id + ' has no attribute ' + par.property
                      });
                  }
                } else {
                  res.notFound().json({
                      message: 'No part with id ' + par.id + ' was found'
                    });
                }
              });
          });

        app.put('/:id/:property', function (req, res) {
            var par = req.params;
            var part = store.get(par.id, function (err, part) {
                if (part) {
                  part[par.property] = req.body.value;
                  store.put(par.id, part, function (err) {
                      if (err) {
                        res.error().json({ message: err.stack });
                        return;
                      }

                      res.ok().json({ message: 'ok' });
                    });
                } else {
                  res.notFound().json({
                      message: 'No part with id ' + par.id + 'was found'
                    });
                }
              });

          });

      })
  );
};

