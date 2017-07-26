import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;
  username = new FormControl('', [Validators.required,
                                  Validators.minLength(2),
                                  Validators.maxLength(30),
                                  Validators.pattern('[a-zA-Z0-9_-\\s]*')]);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
  	this.loginForm = this.formBuilder.group({
      username: this.username
    });
  }

  setClassUsername() {
    return { 'has-error': !this.username.pristine && !this.username.valid };
  }

  login() {
    
  	let result:any = this.userService.login(this.loginForm.value.username);
    if (result === false) {
      this.router.navigate(['/toomuchtabs']);
    } else {
      this.router.navigate(['/chat']);
    }
  	
  }

}
