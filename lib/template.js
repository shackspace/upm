
var connect = require('connect');
var crypto = require('crypto');

templates = {};

exports.template = function () {
  return connect(
      connect.router(function (app) {

        // create template
        app.put('/(:id)', function(req, res) {
          var id = req.params.id;
          templates[id] = req.body; // TODO copy /cart/(:id)
          res.end();
        });

        // instantiate template
        app.post('/(:id)', function(req, res) {
          var id = req.params.id;
          if (id in templates) {
            // TODO POST /cart with a body
            // TODO res.end /cart/id
          } else {
            res.writeHead(404);
            res.end("Not Found\n");
          };
        });

      })
  );
};

exports.templates = function () {
  return connect(
      connect.router(function (app) {

        // retrieve list of all templates
        app.get('/', function(req, res) {
          res.writeHead(200, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify(templates));
        });

      })
  );
};
