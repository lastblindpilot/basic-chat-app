'use strict';
const assert = require('assert');
const Users = require('../lib/users');
const UUID = require('uuid/v4');

let usersCache;

let users = [{
  id: 'u-' + UUID(),
  name: 'Private Joker'
}, {
  id: 'u-' + UUID(),
  name: 'Private Pile'
}];

describe('Test users cache', function() {

  before(function() {
    usersCache = new Users();
  });

  it('creates new User and adds him to storage', function(done) {

    let socketId = 's-' + UUID();
    let hasTabAlready = usersCache.addUser(users[0], socketId);
    assert(usersCache.users[users[0].id]);
    assert(!hasTabAlready);
    assert.equal(usersCache.users[users[0].id].socketId, socketId);
    return done();

  });

  it('creates second User and adds him to storage', function(done) {

    let socketId = 's-' + UUID();
    let hasTabAlready = usersCache.addUser(users[1], socketId);
    assert(usersCache.users[users[1].id]);
    assert(!hasTabAlready);
    assert.equal(usersCache.users[users[1].id].socketId, socketId);
    return done();

  });

  it('must remove socket id from first user', function(done) {

    usersCache.removeUserSocket(users[0].id);
    assert(!usersCache.users[users[0].id].socketId);
    return done();

  });

  it('must imitate that first User opened a new tab', function(done) {

    let socketId = 's-' + UUID();
    let hasTabAlready = usersCache.addUser(users[0], socketId);
    assert(usersCache.users[users[0].id]);
    assert(!hasTabAlready);
    assert.equal(usersCache.users[users[0].id].socketId, socketId);
    return done();

  });

  it('must attach chat id for two users', function(done) {

    let chatId = 'c-' + UUID();
    usersCache.attachChatId(chatId, users[0].id, users[1].id);
    assert(usersCache.users[users[0].id].chats);
    assert(usersCache.users[users[1].id].chats);
    assert.equal(usersCache.users[users[0].id].chats[users[1]], usersCache.users[users[1].id].chats[users[0]]);
    return done();

  });

  it('must detach chat id as User left', function(done) {
    
    usersCache.detachChatId(users[0].id);
    assert(!Object.keys(usersCache.users[users[1].id].chats).length);
    return done();

  });

  it('must remove first User', function(done) {

    usersCache.removeUser(users[0].id);
    assert.equal(Object.keys(usersCache.users).length, 1);
    return done();
  
  });

  it('must remove second User', function(done) {

    usersCache.removeUser(users[1].id);
    assert.equal(Object.keys(usersCache.users).length, 0);
    return done();

  });

});