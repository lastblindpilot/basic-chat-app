class Users {

	constructor() {
		this.users = {}
	}

	addUser(user, socketId) {
		if (!this.users[user.id]) {
			this.users[user.id] = user;
			this.users[user.id].sockets = [socketId];
		} else {
			this.users[user.id].sockets.push(socketId);
		}
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