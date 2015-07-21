/* Import node's http module: */

var handleRequest = require("./request-handler.js")
var express = require("express");
var app = express();
var http = require("http").Server(app); //??? 

var io = require('socket.io')(http);
var path = require("path");

var routes = require("../routes"); //automatically loads index.js in /routes
var port = 3000;

// give us access (static, public) to the /client/ directory
var publicPath = path.join(__dirname, '../public');
console.log(publicPath);


app.use('/public', express.static(publicPath));
routes(app);

io.on('connection', function(socket){
  console.log('client connected');
  
  socket.on('msg', function(msg){
    console.log(msg);
    io.emit('msg', msg);
  })

  socket.on('disconnect', function() {
    console.log('client disconnected');
  })
})



http.listen(port, function(){
  console.log('listening on: ', port);  
}); //http.listen