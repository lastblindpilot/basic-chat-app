// Chat Service
// provides connection with localStorage for saving User chat data
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Injectable()
export class ChatService {

	constructor() {  }
	
	// gets Chat data from localStorage
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

	// saves Chat data to localStorage
	saveChat(chat) {
		localStorage.setItem(chat.id, JSON.stringify(chat));
	}

	// saves one message to Chat history, appends to array of messages
	saveMessage(chatId, message) {
		let chat = JSON.parse(localStorage.getItem(chatId));
		chat.messages.push(message);
		localStorage.setItem(chat.id, JSON.stringify(chat));
	}

	// clears localStorage as soon as User logs out
	logout() {
		localStorage.clear();
	}

}