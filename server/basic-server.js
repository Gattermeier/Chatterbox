var handleRequest = require("./request-handler.js")
var express = require("express");
var app = express();
var http = require("http").Server(app);

var io = require('socket.io')(http);
var path = require("path");

var routes = require("../routes");
var port = 3000;

app.use('/public', express.static(path.join(__dirname, '../public')));
routes(app);

var defaults = {
  chatrooms: ['Main', 'Second', 'Third']
};

io.on('connection', function(socket) {
  console.log('client connected: ', socket.id);

  // send socket default chatrooms
  io.to(socket.id).emit('init', defaults);
  // join main chatroom
  socket.join(defaults.chatrooms[0]);

  socket.on('chat message', function(data) {
    io.to(data['chatroom']).emit('broadcast chat', data);
  })

  socket.on('channel change', function(data) {
    console.log(socket.id, ' wants to join channel: ', data);
    socket.leave();
    socket.join(data);
  })

  socket.on('disconnect', function() {
    console.log('client disconnected');
  })
})


http.listen(port, function() {
  console.log('listening on: ', port);
});