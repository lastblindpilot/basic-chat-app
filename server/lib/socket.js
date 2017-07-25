'use strict';
const IO = require('socket.io');
const Users = require('./users');

module.exports = function(srv) {

  const io = IO.listen(srv);
  let usersCache = new Users();

  io.on('connection', function(socket) {


    console.log('Socket ID connected >> ', socket.id);


    socket.on('user-joined', function(user) {
      console.log('socket ID >>', socket.id);
      console.log('USER JOINED > ', user);
      socket.userId = user.id;
      let userHasTabAlready = usersCache.addUser(user, socket.id);
      console.log('USERS >> ', usersCache.users);
      //let users = usersCache.prepareUsers(user.id);
      console.log('USERS PREPARED >> ', usersCache.users);
      if (userHasTabAlready) {
        socket.emit('user-has-tab-already');
      } else {
        io.sockets.emit('users-update', usersCache.users);
      }
    });





    socket.on('chat-start', function(userId, companyUserId) {
      let chatId = usersCache.getChatId(userId, companyUserId);
      if (!chatId) {
        socket.emit('chat-new', userId, companyUserId);
      }
    });








    socket.on('chat-init', function(chatId, userId, companyUserId) {
      usersCache.attachChatId(chatId, userId, companyUserId);
      console.log('USERS CACHE AFTER CHAT INIT > ', usersCache);
    });



    






    socket.on('disconnect', function() {
      console.log('userId disconnected > ', socket.userId);
      usersCache.removeUserSocket(socket.userId, socket.id);
      console.log('USERS AFTER ONE DISCONNECT >> ', usersCache.users);
    });

    socket.on('user-logout', function(userId) {
      usersCache.removeUser(userId);
      //let users = usersCache.prepareUsers();
      io.sockets.emit('users-update', usersCache.users);
      console.log('user logged out and removed >> ', userId);
      console.log('USERS AFTER ONE LOGOUT >> ', usersCache.users);
    });

    socket.on('message-sent', function(data) {
      console.log('message >> ', data);
      io.sockets.emit('message-echo', data);
    });

  });

  return io;

}