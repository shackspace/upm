
var Connect = require('connect');

var create = exports.create = function () {
  return Connect(
    Connect.router(function (app) {

        app.get('/', function(req, res){
            res.end('Hurr Durr Derp');
          });

      })
  );
};
