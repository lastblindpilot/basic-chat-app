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

  
  private serverUrl = 'http://localhost:3000';
  private socket = IO(this.serverUrl);
  public currentChatId = '';
	public messages = [];
  //message =''; // to delete
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

  ngOnInit() {

    let self = this;

    self.sendForm = this.formBuilder.group({
      message: this.message
    });

    self.user = this.userService.getUser();

    self.socket.emit('user-joined', self.user);

  	console.log('chat init');
    console.log('socket data', self.socket);
    
    self.socket.on('users-update', function(users) {
      console.log('USERS CLIENT >>', users);
      console.log('TYPEOF USERS CLIENT >>', typeof users);

      self.users = self.userService.prepareOwnUsers(users);
    });

    self.socket.on('user-has-tab-already', function() {
      console.log('should redirect this user');
      self.router.navigate(['/toomuchtabs']);
    });





    self.socket.on('chat-init', function(chatId, userId, companyUserId) {
      console.log('CHAT INIT ! >', chatId);
      let chat = self.chatService.getChat(chatId);
      chat.users = [userId, companyUserId];
      self.chatService.saveChat(chat);
      if (self.currCompanyUserId == userId || self.currCompanyUserId == companyUserId) {
        self.currentChatId = chat.id;
        self.messages = chat.messages;
      }
      self.socket.emit('chat-room-subscribe', chat.id);
    });







    self.socket.on('message-new', function(data) {
      self.chatService.saveMessage(data.chatId, data.message);
      let chat = self.chatService.getChat(data.chatId);
      if (chat.users.indexOf(self.currCompanyUserId) >= 0) {
        console.log('WE MUST SHOW CHAT');
        self.currentChatId = chat.id;
        self.messages = chat.messages;
      } else {
        console.log('WE DON"T SHOW CHAT');
      }
    });




/*


    this.socket.on('message-echo', function(data) {
      console.log('message-echo > ', data);
    });*/

  }

  /*sendMessage(e) {
  	e.preventDefault();
  	console.log('Message > ', this.message);
    this.socket.emit('message-sent', this.message);
  	this.message = '';
  }*/

  sendMessage() {
    console.log('send message', this.sendForm.value.message);
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

  logout(e) {
    e.preventDefault();
    this.socket.emit('user-logout', this.user.id);
    this.userService.logout();
    //this.socket.disconnect();
    this.router.navigate(['']);
  }

  chooseChat(companyUserId) {
    //console.log('target >', e.target);
    this.currCompanyUserId = companyUserId;
    this.socket.emit('chat-start', this.user.id, companyUserId);
  }

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
