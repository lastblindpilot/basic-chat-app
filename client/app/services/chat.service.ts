import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable()
export class ChatService {

	constructor() {  }
	
	getChat(chatId) {
		let chat:any = localStorage.getItem(chatId);
		if (!chat) {
			return {
				id: chatId,
				messages: []
			};
		} else {
			chat = JSON.parse(chat);
		}
		return chat;
	}

}