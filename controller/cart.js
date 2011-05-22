
var connect = require('connect');
var crypto = require('crypto');

carts = {};

exports.cart = function () {
  return connect(
      connect.router(function (app) {

        // create cart
        app.post('/', function(req, res) {
          var id = gensym();
          carts[id] = {};
          res.writeHead(200, {
            'Content-Type': 'application/json'
          });
          res.end('"/cart/' + id + '"');
        });

        // retrieve cart
        app.get('/(:id)', function(req, res) {
          var id = req.params.id;
          if (id in carts) {
            var cart = carts[id];
            res.end(JSON.stringify(cart));
          } else {
            res.writeHead(404);
            res.end("Not Found\n");
          };
        });

        // add part to cart
        app.put('/(:cartId)/part/(:partId)', function(req, res) {
          var cartId = req.params.cartId;
          var partId = req.params.partId;
          if (cartId in carts) {
            carts[cartId][partId] = req.body;
            // TODO 409
            res.end();
          } else {
            res.writeHead(404);
            res.end("Not Found\n");
          };
        });

        // remove part from cart
        app.delete('/(:cartId)/part/(:partId)', function(req, res) {
          var cartId = req.params.cartId;
          var partId = req.params.partId;
          if (cartId in carts) {
            var cart = carts[cartId];
            if (partId in cart) {
              delete cart[partId];
              res.end();
            } else {
              res.writeHead(404);
              res.end("Not Found\n");
            };
          } else {
            res.writeHead(404);
            res.end("Not Found\n");
          };
        });

        // delete cart
        app.delete('/(:id)', function(req, res) {
          var id = req.params.id;
          if (id in carts) {
            delete carts[id];
            res.end();
          } else {
            res.writeHead(404);
            res.end("Not Found\n");
          };
        });

      })
  );
};

function gensym () {
  var sha1sum = crypto.createHash('sha1');
  sha1sum.update((new Date()).toString());
  var id = sha1sum.digest('hex');
  return id in carts ? gensym() : id;
};
