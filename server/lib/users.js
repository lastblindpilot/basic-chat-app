'use strict';
class Users {

	constructor() {
		this.users = {}
	}

	addUser(user, socketId) {
		let userHasTabAlready = false;
		if (!this.users[user.id]) {
			this.users[user.id] = user;
			this.users[user.id].sockets = [socketId];
		} else {
			if (this.users[user.id].sockets.length) {
				userHasTabAlready = true;
			} else {
				this.users[user.id].sockets.push(socketId);
			}
		}
		return userHasTabAlready;
	}

	removeUser(userId) {
		delete this.users[userId];
	}

	removeUserSocket(userId, socketId) {
		if (this.users[userId] && this.users[userId].sockets) {
			let socketIdIndex = this.users[userId].sockets.indexOf(socketId);
			if (socketIdIndex >= 0) {
				this.users[userId].sockets.splice(socketIdIndex, 1);
			}
		}
	}

	/*prepareUsers(uId) {
		let users = [];
		for (let userId in this.users) {
      //if (userId != uId) {
        users.push(this.users[userId]); 
      //}
    }
    return users;
	}*/

}

module.exports = Users;