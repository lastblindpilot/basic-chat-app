// User Service
// provides connection with localStorage to save User data and login data
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable()
export class UserService {

	constructor() {  }

	// logins User and gives him ID
	login(name) {
		let user = {
			id: 'u-'+UUID.UUID(),
			name: name
		}
		if (localStorage.getItem('chatUser') != null) {
			return false;
		} 
		localStorage.setItem('chatUser', JSON.stringify(user));
		return { id: user.id, name: user.name };
	}

	// gets current User of localStorage
	getUser() {
		let user = JSON.parse(localStorage.getItem('chatUser'));
		return user;
	}

	// gets User ID
	getUserId() {
		let user = JSON.parse(localStorage.getItem('chatUser'));
		return (user) ? user.id : null;
	}

	// checks if User is Logged in
	isLoggedIn() {
		return localStorage.hasOwnProperty('chatUser');
	}

	// prepares user chat array for current User
	prepareOwnUsers(usersData) {
		let ownUsers = [];
		for (let userId in usersData) {
			if (userId != this.getUserId()) {
				ownUsers.push(usersData[userId]);
			}
		}
		return ownUsers;
	}

	// clears current User in localStorage on User log out
	logout() {
		localStorage.removeItem('chatUser');
	}

}