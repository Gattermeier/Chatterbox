var handleRequest = require("./request-handler.js")
var express = require("express");
var app = express();
var http = require("http").Server(app);

var io = require('socket.io')(http);
var path = require("path");

var _ = require('underscore');
var routes = require("../routes");
var port = 3000;

app.use('/public', express.static(path.join(__dirname, '../public')));
routes(app);

var defaults = {
  chatrooms: ['Main', 'Second', 'Third']
};

var messages = [];

io.on('connection', function(socket) {
  console.log('client connected: ', socket.id);

  // send socket default chatrooms
  io.to(socket.id).emit('init', defaults);
  // join main chatroom
  socket.join(defaults.chatrooms[0]);

  socket.on('chat message', function(data) {
    messages.push(data);
    io.to(data['chatroom']).emit('broadcast chat', data);
  })

  // when client request a channel change
  socket.on('channel change', function(channel) {
    console.log(socket.id, ' wants to join channel: ', channel);
    // if socket had a channel before, leave the channel
    if (socket.lastChannel) {
      socket.leave(socket.lastChannel);
      socket.lastChannel = null;
    }
    socket.join(channel);
    socket.lastChannel = channel;
    // send last messages of current channel to socket
    var channelMessages = _.filter(messages, function(item) {
      if (item['chatroom'] === channel) {
        return item;
      }
    })
    io.to(socket.id).emit('channel rebuild', channelMessages);
  })

  socket.on('disconnect', function() {
    console.log('client disconnected');
  })
})


http.listen(port, function() {
  console.log('listening on: ', port);
});