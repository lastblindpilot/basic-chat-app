import { Component, OnInit, NgZone } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { UserService } from '../services/user.service';
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
  public currentConversation = null;


  constructor( private userService: UserService,
               private router: Router,
               private zone: NgZone ) {}

  ngOnInit() {

    this.socket.emit('user-joined', this.userService.getUser());

  	console.log('chat init');
    console.log('socket data', this.socket);
    let self = this;
    this.socket.on('users-update', function(users) {
      console.log('USERS CLIENT >>', users);
      console.log('TYPEOF USERS CLIENT >>', typeof users);

      self.users = self.userService.prepareOwnUsers(users);
    });

    this.socket.on('user-has-tab-already', function() {
      console.log('should redirect this user');
      self.router.navigate(['/toomuchtabs']);
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

  chooseUser(userId) {
    //console.log('target >', e.target);
    this.currentConversation = userId;
    this.socket.emit('user-choose-conversation', this.userService.getUserId(), userId);
  }

}
