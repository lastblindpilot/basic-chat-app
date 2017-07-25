'use strict';
class Users {

	constructor() {
		this.users = {}
	}

	addUser(user, socketId) {
		let userHasTabAlready = false;
		if (!this.users[user.id]) {
			this.users[user.id] = user;
			this.users[user.id].socketId = socketId;
		} else {
			if (this.users[user.id].socketId) {
				userHasTabAlready = true;
			} else {
				this.users[user.id].socketId = socketId;
			}
		}
		return userHasTabAlready;
	}

	removeUser(userId) {
		delete this.users[userId];
	}

	removeUserSocket(userId, socketId) {
		if (this.users[userId] && this.users[userId].socketId) {
			this.users[userId].socketId = null;
		}
	}

	getChatId(userId, companyUserId) {
		if (this.users[userId] && this.users[userId].chats) {
			return this.users[userId].chats[companyUserId];
		}
	}

	attachChatId(chatId, userId, companyUserId) {
		if (this.users[userId]) {
			if (!this.users[userId].chats) {
				this.users[userId].chats = {};
			}
			this.users[userId].chats[companyUserId] = chatId;
		}
		if (this.users[companyUserId]) {
			if (!this.users[companyUserId].chats) {
				this.users[companyUserId].chats = {};
			}
			this.users[companyUserId].chats[userId] = chatId;
		}
	}

}

module.exports = Users;