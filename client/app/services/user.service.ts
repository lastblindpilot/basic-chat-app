import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable()
export class UserService {

	constructor() {  }

	login(name) {
		let user = {
			id: UUID.UUID(),
			name: name
		}
		localStorage.setItem('chatUser', JSON.stringify(user));
		return { id: user.id, name: user.name };
	}

	addSocket(socketId) {
		let user = JSON.parse(localStorage.getItem('chatUser'));
		user.sockets.push(socketId);
		localStorage.setItem('chatUser', JSON.stringify(user));
	}

	getUser() {
		let user = JSON.parse(localStorage.getItem('chatUser'));
		return user;
	}

	getUserId() {
		let user = JSON.parse(localStorage.getItem('chatUser'));
		return user.id;
	}

	isLoggedIn() {
		return localStorage.hasOwnProperty('chatUser');
	}

	prepareOwnUsers(usersData) {
		let ownUsers = [];
		for (let userId in usersData) {
			if (userId != this.getUserId()) {
				ownUsers.push(usersData[userId]);
			}
		}
		return ownUsers;
	}

	logout() {
		localStorage.removeItem('chatUser');
	}

}