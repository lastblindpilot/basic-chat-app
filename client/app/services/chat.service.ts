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

	// marks last message of chat read
	markMessagesRead(chatId) {
		console.log('chatId', chatId);

		let chat = JSON.parse(localStorage.getItem(chatId));

		console.log('chat', chat);
		let iter = 0;
		console.log('chat.messages', chat.messages);
		while (chat.messages[chat.messages.length - 1 - iter] && chat.messages[chat.messages.length - 1 - iter].isRead == false) {
			chat.messages[chat.messages.length - 1 - iter].isRead = true;
			iter++;
		}
		localStorage.setItem(chatId, JSON.stringify(chat));
	}

	// checks if last message in chat history
	// is company user message and if it is not read
	isLastMessageOfCompanyIsNotRead(chat, userId) {
		let msgsLength = chat.messages.length;
		if (!msgsLength) {
			return false;
		} else {
			return ((chat.messages[msgsLength - 1].userId != userId) && (chat.messages[msgsLength - 1].isRead == false));
		}
	}

	removeChat(chatId) {
		localStorage.removeItem(chatId);
	}

	// clears localStorage as soon as User logs out
	logout() {
		localStorage.clear();
	}

}