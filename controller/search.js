var Connect = require('connect');
var qs = require('qs')
var url = require('url')

// dummy data -> get these from the database backend
var parts = { '00000' : { 'penis' : '20inch', 'balls': 'made of steel' } ,
          '00001' : { 'penis' : 'tiny', 'balls' :'none' }, 
          '00002' : { 'vagina' : 'hairy', 'breast' :'fuckin huge!' },
          '00003' : { 'vagina' : 'shaved', 'breast' :'flat chest' }
}
var templates = { "shemale" :{ '00001' : '2000 [stueck]' , '00003' : '>9001 stueck' }, "doublepenisbob" : {"00000" : "2", "00001" : "1"} }
// end of dummy data

var log = {}
function getAllMatching( datatypes, query )
{
  log.debug("Query: "+query)
  var ret = {}
  if (query === '') return ret
  Object.keys(datatypes).forEach(function (data_key)
  {
    var data = datatypes[data_key]
    Object.keys(data).forEach(function (attr_key)
    {
      var attr = data[attr_key]
      if (attr.search(query) != -1)
      {
        log.debug (query + " in " +attr + " from " + data_key);
        ret[data_key] = data
      }
    });
  });
  return ret
}
exports.search = function (server) {
  log = server.log
  return Connect(
    Connect.router(function (app) {
        app.get('/parts', function(req, res){
            var parsedParams = qs.parse(url.parse(req.url).query)
            var ret = {}
            server.store.parts.all(function (err,parts) {
              if (err) {
                res.error().json({ message: "you are made of stupid." + err.stack});
                return 23
              }
              if ('fulltext' in parsedParams)
              {
                query = parsedParams['fulltext']
                ret = getAllMatching(all,query)
              }
              res.end(JSON.stringify(ret));
            });
          });

        app.get('/templates', function(req, res){
            var parsedParams = qs.parse(url.parse(req.url).query)
            var ret = {}
            if ('fulltext' in parsedParams )
            {
              var query = parsedParams['fulltext']

              server.store.parts.all(function (err,templates) {
                if (err) {
                  res.error().json({ message: "you are made of stupid." + err.stack});
                  return 23
                }
                Object.keys(templates).forEach(function (template_key)
                {
                  var template = templates[template_key] 
                  var all_parts = {} 
                  Object.keys(template).forEach(function (part_key) // resolve parts
                  {
                    all_parts[part_key] = parts[part_key]
                  });
                  var found_parts = getAllMatching(all_parts,query)
                  log.debug("found parts:"+ JSON.stringify(found_parts))
                  if ( Object.keys(found_parts).length > 0 )
                  {
                    log.debug(template_key)
                    ret[template_key] = template
                    log.debug(JSON.stringify(ret))
                  }
                });
              }
              res.end(JSON.stringify(ret));
            });
          });
      })
  );
}
