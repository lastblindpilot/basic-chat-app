import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoutingModule } from './routing.module';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { LoginGuardService } from './services/loginguard.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [UserService, AuthService, LoginGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
