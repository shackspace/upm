
var connect = require('connect');
var crypto = require('crypto');
var uuid = require('node-uuid');

exports.cart = function (context) {
  var store = context.store.carts;
  //var log = context.log;
  return connect(
      connect.router(function (app) {

        // create cart
        app.post('/', function(req, res) {
          var id = uuid();
          store.put(id, {}, function (err) {
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
          store.exists(id, function (err, exists) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end('false');
            } else {
              if (exists) {
                store.get(id, function (err, item) {
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
          store.get(cartId, function (err, cart) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end('false');
            } else {
              try {
                var amount = Number(Object.keys(req.body)[0]);
                if (isNaN(amount))
                  throw new Error('Your Argument Is Invalid@!!!');
              } catch (exn) {
                  res.writeHead(400, 'You are made of stupid', {
                    'Content-Type': 'application/json'
                  });
                  return res.end('false');
              };
              cart[partId] = amount
              store.put(cartId, cart, function (err) {
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
          store.get(cartId, function (err, cart) {
            if (err) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end('false');
            } else {
              delete cart[partId];
              store.put(cartId, cart, function (err) {
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
          store.del(id, function (err) {
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
