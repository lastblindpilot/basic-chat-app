// Main Chat Logic Component
import { Component, OnInit, NgZone } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
import * as IO from 'socket.io-client';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // Socket IO init
  private serverUrl = 'http://localhost:3000';
  private socket = IO(this.serverUrl);
  // main variables
  public currentChatId = null;
	public messages = [];
  public user;
  public users = [];
  public currCompanyUserId = null;
  public sendForm: FormGroup;
  message = new FormControl('', [Validators.required,
                                  Validators.minLength(1)]);


  constructor( private userService: UserService,
               private chatService: ChatService,
               private formBuilder: FormBuilder,
               private router: Router,
               private zone: NgZone ) {}

  // Component init
  ngOnInit() {

    let self = this;

    self.sendForm = this.formBuilder.group({
      message: this.message
    });

    self.user = this.userService.getUser();

    // User joined to Chat App event
    self.socket.emit('user-joined', self.user);

    // Updates own Chat list
    self.socket.on('users-update', function(users) {
      self.users = self.userService.prepareOwnUsers(users);
    });

    // Redirects to one-tab restriction notification
    self.socket.on('user-has-tab-already', function() {
      self.router.navigate(['/toomuchtabs']);
    });

    self.socket.on('user-company-logged-out', function(chatId) {
      if (self.currentChatId == chatId) {
        self.currentChatId = null;
        self.messages = [];
      }
      self.chatService.removeChat(chatId);
    });

    // As soon as chat is initialized between two users
    // both users subscribe to one Socket Room
    // to recieve messages from each other
    self.socket.on('chat-init', function(chatId, userId, companyUserId) {
      let chat = self.chatService.getChat(chatId);
      if (!chat.users) {
        chat.users = [userId, companyUserId];
        self.chatService.saveChat(chat);
      }
      if (chat.users.indexOf(self.currCompanyUserId) >= 0) {
        self.currentChatId = chat.id;
        if (self.chatService.isLastMessageOfCompanyIsNotRead(chat, self.user.id)) {
           self.socket.emit('message-read', chatId);
           self.users = self.userService.markUserRead(self.users, self.currCompanyUserId);
        } else {
           self.messages = chat.messages;
        }

      }
      self.socket.emit('chat-room-subscribe', chat.id);
    });

    // saves new messages and shows chat if User is in the current Chat Room
    self.socket.on('message-new', function(data) {

      self.chatService.saveMessage(data.chatId, data.message);
      let chat = self.chatService.getChat(data.chatId);
      if (chat.users.indexOf(self.currCompanyUserId) >= 0) {
        // received message to ACTIVE chat room
        if (data.message.userId != self.user.id) {
          // it is message of company user
          self.socket.emit('message-read', data.chatId);
        } else {
          // it is message of user himself, we should not mark it read or not
          self.messages = chat.messages;
        }
      } else {
        // received message to INACTIVE chat room
        if (data.message.userId != self.user.id) {
          self.users = self.userService.markUserUnread(self.users, data.message.userId);
        }
      }
    });

    self.socket.on('message-mark-read', function(chatId) {
      self.chatService.markMessagesRead(chatId);
      let chat = self.chatService.getChat(chatId);
      if (chat.users.indexOf(self.currCompanyUserId) >= 0) {
        //self.currentChatId = chat.id;
        self.messages = chat.messages;
      }
    });

  }

  // generates and sends Message
  sendMessage() {
    let self = this;
    self.socket.emit('message-send', {
      /*userId: self.user.id,
      companyUserId: self.currCompanyUserId,*/
      chatId: this.currentChatId,
      message: {
        userId: self.user.id,
        userName: self.user.name,
        text: self.sendForm.value.message,
        time: self.formatAMPM(new Date()),
        isRead: false
      }
    });
    this.sendForm.reset();
  }

  // main logout action
  // uses socket event, userService
  // and chatService to clear all User Data from localStorage
  logout(e) {
    e.preventDefault();
    this.socket.emit('user-logout', this.user.id);
    this.userService.logout();
    this.chatService.logout();
    this.router.navigate(['']);
  }

  // sends start chat event as chat room is chosen
  chooseChat(companyUserId) {
    this.currCompanyUserId = companyUserId;
    this.socket.emit('chat-start', this.user.id, companyUserId);
  }

  // helper method to format time for Message sent
  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

}
