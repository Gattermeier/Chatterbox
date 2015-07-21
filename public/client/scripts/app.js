// YOUR CODE HERE:
window.friends = {};
window.data = {};
var app = {};

app.username = '';

app.init = function() {
  var rooms = app.findRooms(window.data.results);
  app.printRooms(rooms);
};

app.server = 'http://127.0.0.1:3000/classes/messages'

app.send = function(postPackage) { // message = {username, text, roomname}
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
    type: 'POST',
    data: JSON.stringify(postPackage),
    contentType: 'application/json', //what does this mean?
    success: function(data) {
      // console.log('chatterbox: Message sent: ');
    },
    error: function(data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message:' + JSON.stringify(data));
    }
  }); //ajax
};


app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    success: function(data) {
      app.displayPosts(data);
      window.data = data;
      // console.log('Success');
    },
    dataType: 'json'
  });
};

//func: popup user name input at the beginning of the app
app.login = function() {
  console.log('here');
  // $("#logindiv").css("display", "inline");
  $('#logindiv').show();
  // $('#logindiv').hide()
  // debugger 
};

$(document).on("click", "#login", function() {
  user = $("#name").val();
  if (user === "") {
    user = "Guest";
  }
  app.username = user;
  $("#logindiv").css("display", "none");
  $("#username").text(app.username);
}); //#login.click()

//func: accepts array of room names and adds an option to the dropdown for each
app.printRooms = function(rooms) {
  $('#chatrooms').html(''); //clear previous options
  
  var defaultOption = $('<option selected></option>').val('All Rooms').text('All Rooms');
  $('#chatrooms').append(defaultOption);

  for (var key in rooms) {
    var newOptions = $('<option></option>').val(key).text(key);
    if(key===window.chatRoom){
      newOptions.attr('selected',true);
    } //if
    $('#chatrooms').append(newOptions);
  }  //for
  // debugger
  // var fakeOption = $('<option></option>').val('').text('-------------');
  // $('#chatrooms').prepend(fakeOption);
};

//func: accepts array of message objects, and returns all unique room properties from those messages
app.findRooms = function(messageArray) { //should accept results array from window.data

  var result = {};
  // debugger
  for (var i = 0; i < messageArray.length; i++) {
    var message = messageArray[i];
    var key = message.roomname;
    if (key !== undefined && key !== null && key !== '') {
      result[key] = key;
    } //if
  } //for
  // console.log('result:'+JSON.stringify(result));
  return result;
};

//************** Initialize app
$(document).ready(function(){
  // app.login();
  setInterval(app.fetch, 1000); //display messages
  app.fetch(); //fetch stuff for the first time
  setTimeout(function() { //wait for the fetch to return data, then update room dropdown
    app.init();
  }, 1500); //setTimeout
}); //document ready
//************** 


//func: print posts to the page
app.displayPosts = function(data, roomname) {
  $('#messages').html('');
  var results = data.results;


  for (var i = 0; i < results.length; i++) {
    var chat = results[i];
    // console.log(results[i]);
    var newDiv = $('<div></div>');
    var nameSpan = $("<span class='chatName'></span>").text(chat['username']);
    var textSpan = $("<span class='chatText'></span>").text(": " + chat['text']);
    newDiv.append(nameSpan).append(textSpan);

    if (chat['username'] in window.friends) { // note: if chat['username'] is inside window.friends object, bold the newDiv element by adding 'friend' class
      console.log('adding class to user: ' + chat['username']);
      newDiv.addClass('friends');
    }

    if (chat['roomname'] === window.chatRoom) {
      $('#messages').append(newDiv);
    } else if (window.chatRoom === undefined || window.chatRoom === 'All Rooms') {
      $('#messages').append(newDiv);
    } //if
  } //for
};

//write message
$(document).on('click', '#submitMessage', function() {
  var input = $('#inputMessage').val();
  console.log('input message:', input);
  var message = {};
  message['username'] = app.username === '' ? "Guest" : app.username;
  message['text'] = input;
  message['roomname'] = window.chatRoom;

  if (message === '') {
    alert('Message is empty, please try again');
    return;
  } else {
    app.send(message);
    $('#inputMessage').val('');
  }
});

//func: create a new room
$(document).on('click', '#submitRoom', function() {
  var input = $('#inputRoom').val();
  $('#inputRoom').val('');
  window.chatRoom = input; 

  var message = {};
  message['username'] = "WelcomeBot";
  message['text'] = "Welcome to "+window.chatRoom;
  message['roomname'] = window.chatRoom;
  app.send(message);
  setTimeout(app.init, 1000);

});


// func: Befriend user
$(document).on('click', '#messages .chatName', function() {
  var name = $(this).text();
  console.log('chat clicked()' + name);
  if (name in window.friends) {
    delete window.friends[name];
  } else {
    window.friends[name] = true;
  } //if
  // app.init();
});

$(document).on('change', 'select', function() {
  console.log('clicked options');
  window.chatRoom = $("#chatrooms").val();
  app.init(); //reload options after chatRoom has been set
  // app.init();
}); //select.change()

/*

{
  username: "PLCT",
  text: "what's up",
  roomname: '8th floor'
}
test ObjectId:

    url: "https://api.parse.com/1/classes/chatterbox/QmqKIzbsT7

*/