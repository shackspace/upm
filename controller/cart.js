
var connect = require('connect');
var crypto = require('crypto');

exports.cart = function () {
  return connect(
      connect.router(function (app) {

        // create cart
        app.post('/', function(req, res) {
          var id = gensym();
          app.store.carts.put(id, {}, function (err) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end('false');
            } else {
              res.writeHead(200, {
                'Content-Type': 'application/json'
              });
              res.end('"/cart/' + id + '"');
            };
          });
        });

        // retrieve cart
        app.get('/(:id)', function(req, res) {
          var id = req.params.id;
          app.store.carts.exists(id, function (err, exists) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end('false');
            } else {
              if (exists) {
                app.store.carts.get(id, function (err, item) {
                  if (err) {
                    res.writeHead(500, {
                      'Content-Type': 'application/json'
                    });
                    res.end('false');
                  } else {
                    res.writeHead(200, {
                      'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(item));
                  };
                });
              } else {
                res.writeHead(404);
                res.end("Not Found\n");
              };
            };
          });
        });

        // add part to cart
        app.put('/(:cartId)/part/(:partId)', function(req, res) {
          var cartId = req.params.cartId;
          var partId = req.params.partId;
          // TODO 404 would be nice
          app.store.carts.get(cartId, function (err, cart) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end('false');
            } else {
              cart[partId] = req.body;
              app.store.carts.put(cartId, cart, function (err) {
                if (err) {
                  res.writeHead(500, {
                    'Content-Type': 'application/json'
                  });
                  res.end('false');
                } else {
                  res.writeHead(200, {
                    'Content-Type': 'application/json'
                  });
                  res.end('true');
                };
              });
            };
          });
        });

        // remove part from cart
        app.delete('/(:cartId)/part/(:partId)', function(req, res) {
          var cartId = req.params.cartId;
          var partId = req.params.partId;
          // TODO 404 would be nice
          app.store.carts.get(cartId, function (err, cart) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end('false');
            } else {
              delete cart[partId];
              app.store.carts.put(cartId, cart, function (err) {
                if (err) {
                  res.writeHead(500, {
                    'Content-Type': 'application/json'
                  });
                  res.end('false');
                } else {
                  res.writeHead(200, {
                    'Content-Type': 'application/json'
                  });
                  res.end('true');
                };
              });
            };
          });
        });

        // delete cart
        app.delete('/(:id)', function(req, res) {
          var id = req.params.id;
          // TODO 404 would be nice
          app.store.carts.del(id, function (err) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end('false');
            } else {
              res.writeHead(200, {
                'Content-Type': 'application/json'
              });
              res.end('true');
            };
          });
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
