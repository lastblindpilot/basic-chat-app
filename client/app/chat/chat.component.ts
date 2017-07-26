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
  public chatId = '';
	public messages = [];
  //message =''; // to delete
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





    self.socket.on('chat-init', function(chatId) {
      console.log('CHAT INIT ! >', chatId);
      let chat = self.chatService.getChat(chatId);
      self.chatId = chat.id;
    });







    this.socket.on('message-echo', function(data) {
      console.log('message-echo > ', data);
    });

  }

  /*sendMessage(e) {
  	e.preventDefault();
  	console.log('Message > ', this.message);
    this.socket.emit('message-sent', this.message);
  	this.message = '';
  }*/

  sendMessage() {
    console.log('send message', this.sendForm.value.message);
    this.sendForm.reset();
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
    this.currCompanyUserId = companyUserId;
    this.socket.emit('chat-start', this.userService.getUserId(), companyUserId);
  }

}
