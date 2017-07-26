'use strict';
const IO = require('socket.io');
const Users = require('./users');
const UUID = require('uuid/v4');

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
        chatId = 'c-'+UUID();
        usersCache.attachChatId(chatId, userId, companyUserId);
      } 
      io.to(usersCache.users[userId].socketId).emit('chat-init', chatId, userId, companyUserId);
      io.to(usersCache.users[companyUserId].socketId).emit('chat-init', chatId, userId, companyUserId);
    });

    socket.on('chat-room-subscribe', function(chatId) {
      console.log('User joined to Chat > ', chatId);
      socket.join(chatId);
    });

    socket.on('message-send', function(data) {
      console.log('message sent', data.chatId, data.message)
      io.sockets.in(data.chatId).emit('message-new', data);
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