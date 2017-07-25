import { Component, OnInit, NgZone } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { UserService } from '../services/user.service';
import { ChatService } from '../services/chat.service';
import * as IO from 'socket.io-client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private serverUrl = 'http://localhost:3000';
  private socket = IO(this.serverUrl);
	message = '';
  public users = [];
  public currentChat = null;


  constructor( private userService: UserService,
               private chatService: ChatService,
               private router: Router,
               private zone: NgZone ) {}

  ngOnInit() {

    let self = this;

    this.socket.emit('user-joined', this.userService.getUser());

  	console.log('chat init');
    console.log('socket data', this.socket);
    
    this.socket.on('users-update', function(users) {
      console.log('USERS CLIENT >>', users);
      console.log('TYPEOF USERS CLIENT >>', typeof users);

      self.users = self.userService.prepareOwnUsers(users);
    });

    this.socket.on('user-has-tab-already', function() {
      console.log('should redirect this user');
      self.router.navigate(['/toomuchtabs']);
    });








    this.socket.on('chat-new', function(userId, companyUserId) {
      let chatId = self.chatService.initChat();
      self.socket.emit('chat-init', chatId, userId, companyUserId);
    });









    this.socket.on('message-echo', function(data) {
      console.log('message-echo > ', data);
    });

  }

  sendMessage(e) {
  	e.preventDefault();
  	console.log('Message > ', this.message);
    this.socket.emit('message-sent', this.message);
  	this.message = '';
  }

  logout(e) {
    e.preventDefault();
    this.socket.emit('user-logout', this.userService.getUserId());
    this.userService.logout();
    //this.socket.disconnect();
    this.router.navigate(['']);
  }

  chooseChat(companyUserId) {
    //console.log('target >', e.target);
    this.currentChat = companyUserId;
    this.socket.emit('chat-start', this.userService.getUserId(), companyUserId);
  }

}
