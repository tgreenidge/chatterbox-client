// YOUR CODE HERE:
 var app = { 
  server: 'https://api.parse.com/1/classes/chatterbox',
  rooms: [], 
  friends: [],
  init: function(){
    $("#roomSelect").on('click', app.showRooms);
    $("#roomSelect").on('change', app.toogleCreateRoom); 
    $("#chats").on('click', '.username', function(event){
      event.preventDefault();   
      app.addFriend(event);
    });
    $("#send").submit(app.handleSubmit);
    $("#refresh").click(app.fetch); 
    app.fetch(); 
  },
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  fetch: function(){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: app.server,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();

        for(var i = 0; i < data.results.length; i++){
          app.appendMessage(data.results[i]);
          if(_.indexOf(app.rooms, data.results[i].roomname) === -1 ){
            app.rooms.push(data.results[i].roomname);
          }
        } 
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message');
      }
    });
  },
  clearMessages: function(){
    $('#chats').empty(); 
  },
  appendMessage: function(message){
    if(message.roomname === $('#roomSelect option:selected').val() || $('#roomSelect option:selected').val()==="allRooms"){
      if(_.indexOf(app.friends, message.username) !== -1){
        $('#chats').append("<div class='username friend'>" +_.escape(message.username) + ": " + 
          _.escape(message.text) +" </div>");
        $('#chats').append('<hr>');
      }
      else{
         $('#chats').append("<div class='username'>" +_.escape(message.username) + ": " + 
          _.escape(message.text) +" </div>");
         $('#chats').append('<hr>');
      }
    }
  },
  addRoom: function(roomName){
    if($('#' + roomName).length === 0){ //room is not defined
      app.rooms.push(roomName); 
      $('#roomSelect').append('<div id=' + roomName +'> </div>');
    }
  },
  addFriend: function(eventClicked){ 
    console.log($(eventClicked.currentTarget)); 
    var friendName = $(eventClicked.currentTarget).text().split(":")[0];
    app.friends.push(friendName);
    app.fetch(); 
  },

  handleSubmit: function(event){
    event.preventDefault(); 
    console.log("submitted");
    var message = {}; 
    message.text = $(".submitted").val(); 
    message.username = window.location.search.split("=")[1];
    if($("#roomSelect option:selected").val() !== "createRoom"){
      message.roomname = $('#roomSelect option:selected').val();
    }else{
      message.roomname = $(".newRoom").val();
      app.addRoom(message.roomname);
    }
    app.send(message);
    app.fetch(); 
    $(".submitted").val('');
  },

  showRooms: function(){
    $('#roomSelect').empty();
    $('#roomSelect').append('<option value = "allRooms"> All Rooms </option>');
    $('#roomSelect').append('<option value = "createRoom"> Create New Room </option>');
    for(var i = 0; i < app.rooms.length; i++){
      $('#roomSelect').append('<option value="' + app.rooms[i] + '">' + app.rooms[i] + ' </option>');
    }
  },
  
  toogleCreateRoom: function(){
    if($('#roomSelect option:selected').val() === "createRoom"){
      $('#send').append('<input type = "text" class = "newRoom" value = "Enter New Room Name:">');
    }else{
      $(".newRoom").remove();
    }
  }
 };

$(document).ready(function(){
  app.init();
});

