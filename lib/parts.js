
var Connect = require('connect');

exports.part = function () {
  return Connect(
    Connect.router(function (app) {

        app.get('/', function(req, res){
            res.end('Hurr Durr Derp');
          });

      })
  );
};

exports.parts = function () {
  return Connect(
    Connect.router(function (app) {

        app.get('/', function(req, res){
            res.end('Hurr Durr Derp');
          });

      })
  );
};

