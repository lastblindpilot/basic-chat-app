'use strict';
class Users {

	/*
		Class forserver side Users Cache
	*/

	constructor() {
		this.users = {}
	}

	// adds new user to storage
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

	// removes user
	removeUser(userId) {
		delete this.users[userId];
	}

	// removes socket from User data if User is logged in
	// but left all the tabs he used
	removeUserSocket(userId, socketId) {
		if (this.users[userId] && this.users[userId].socketId) {
			this.users[userId].socketId = null;
		}
	}

	// gets chatId bewtween two Users
	getChatId(userId, companyUserId) {
		if (this.users[userId] && this.users[userId].chats) {
			return this.users[userId].chats[companyUserId];
		} else {
			return null;
		}
	}

	// attaches chatId for Users data
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

	// detaches chatId for Users data
	detachChatId(userId) {
		if(Object.keys(this.users).length) {
			for (let uId in this.users) {
				if (this.users[uId].chats) {
					delete this.users[uId].chats[userId];
				}
			}
		}
	}

}

module.exports = Users;