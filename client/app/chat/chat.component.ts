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
  public currentChatId = '';
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

    // As soon as chat is initialized between two users
    // both users subscribe to one Socket Room
    // to recieve messages from each other
    self.socket.on('chat-init', function(chatId, userId, companyUserId) {
      let chat = self.chatService.getChat(chatId);
      chat.users = [userId, companyUserId];
      self.chatService.saveChat(chat);
      if (self.currCompanyUserId == userId || self.currCompanyUserId == companyUserId) {
        self.currentChatId = chat.id;
        self.messages = chat.messages;
      }
      self.socket.emit('chat-room-subscribe', chat.id);
    });

    // saves new messages and shows chat if User is in the current Chat Room
    self.socket.on('message-new', function(data) {
      self.chatService.saveMessage(data.chatId, data.message);
      let chat = self.chatService.getChat(data.chatId);
      if (chat.users.indexOf(self.currCompanyUserId) >= 0) {
        self.currentChatId = chat.id;
        self.messages = chat.messages;
      } else {
        //implement amount of messages recieved on each unactive chat room on sidebar
      }
    });

  }

  // generates and sends Message
  sendMessage() {
    let self = this;
    self.socket.emit('message-send', {
      chatId: this.currentChatId,
      message: {
        userId: self.user.id,
        userName: self.user.name,
        text: self.sendForm.value.message,
        time: self.formatAMPM(new Date())
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
