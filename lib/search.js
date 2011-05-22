var Connect = require('connect');

exports.search = function () {
  return Connect(
    Connect.router(function (app) {

        app.get('/', function(req, res){
            res.end('MORE COBRA PARTS');
          });

      })
  );
}
