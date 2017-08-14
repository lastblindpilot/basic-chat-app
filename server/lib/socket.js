'use strict';
const IO = require('socket.io');
const Users = require('./users');
const UUID = require('uuid/v4');

// Main Server Socket logic
// store User data in Server side Cache

module.exports = function(srv) {

  const io = IO.listen(srv);
  let usersCache = new Users();

  io.on('connection', function(socket) {

    socket.on('user-joined', function(user) {
      socket.userId = user.id;
      let userHasTabAlready = usersCache.addUser(user, socket.id);
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
      socket.join(chatId);
    });

    socket.on('message-send', function(data) {
      console.log('usersCache >> ', usersCache);
      console.log('data >> ', data);
      io.sockets.in(data.chatId).emit('message-new', data);
    });

    /*socket.on('message-sent', function(data) {
      io.sockets.emit('message-echo', data);
    });*/

    socket.on('message-read', function(chatId) {
      io.sockets.in(chatId).emit('message-mark-read', chatId);
    });

    socket.on('disconnect', function() {
      usersCache.removeUserSocket(socket.userId, socket.id);
    });

    socket.on('user-logout', function(userId) {
      usersCache.detachChatId(userId);
      usersCache.removeUser(userId);
      //let users = usersCache.prepareUsers();
      io.sockets.emit('users-update', usersCache.users);
    });

  });

  return io;

}