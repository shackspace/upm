
var Connect = require('connect');

exports.cart = function () {
  return Connect(
    Connect.router(function (app) {
        app.get('/', function(req, res){
            res.end('Hurr Durr Derp');
          });

      })
  );
};
