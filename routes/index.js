var path = require('path');

module.exports = function(app) {


  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../public/client/index.html'));
  });

  app.get('/classes/messages', function(req, res) {
    var statusCode = 200;
    headers['Content-Type'] = "application/json";
    res.writeHead(statusCode, headers);
    res.end(JSON.stringify(messages));
  });

  app.post('/classes/messages', function(req, res) {
    var statusCode = 201;
    headers['Content-Type'] = "application/json";
    res.writeHead(statusCode, headers);

    var body = ''; //reset body variable

    req.on('data', function(chunk) {
      body += chunk;
    }); //req

    req.on('end', function() {
      messages.results.push(JSON.parse(body));
      res.end(JSON.stringify(messages));
    }); //req.on

  }); //app.post

}

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

// var body; 
var messages = {};
messages.results = [];

var headers = defaultCorsHeaders;