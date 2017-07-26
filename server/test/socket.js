'use strict';
const assert = require('assert');
const clientIO = require('socket.io-client');
const UUID = require('uuid/v4');

const server = require('../bin/www');

const socketUrl = 'http://localhost:3000';
let options ={
  transports: ['websocket'],
  'force new connection': true
};

let users = [{
  id: 'u-' + UUID(),
  name: 'Private Joker'
}, {
  id: 'u-' + UUID(),
  name: 'Private Pile'
}];

let client1 = clientIO.connect(socketUrl, options);
let client2 = clientIO.connect(socketUrl, options);

describe('test socket IO is able to emit events', function() {

	it('must send two new Users', function(done) {

		let data;

		setTimeout(function() {

			assert.equal(Object.keys(data).length, 2);
			return done();

		}, 1500);

		client1.emit('user-joined', users[0]);
		client2.emit('user-joined', users[1]);
		client1.on('users-update', function(usersData) {
			data = usersData;
		});

	});

});

describe('test  chat initialization', function() {

	after(function() {
		server.close();
	});

	it('must create w chats for users', function() {

		let data = [];

		setTimeout(function() {

			assert.equal(data[0], data[1]);
			return done();

		}, 1500);

		client1.emit('chat-start', users[0].id, users[1].id);
		client2.emit('chat-start', users[1].id, users[0].id);

		client1.on('chat-init', function(chatId, userId, companyUserId) {
			data.push(chatId);
		});

		client2.on('chat-init', function(chatId, userId, companyUserId) {
			data.push(chatId);
		});

	})

});
