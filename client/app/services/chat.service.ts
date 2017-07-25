import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable()
export class ChatService {

	constructor() {  }
	
	initChat() {
		let chat = {
			id: 'c-'+UUID.UUID(),
			messages: []
		};
		localStorage.setItem(chat.id, JSON.stringify(chat));
		return chat.id;
	}

}