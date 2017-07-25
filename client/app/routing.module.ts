import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { AuthService } from './services/auth.service';
import { LoginGuardService } from './services/loginguard.service';

const routes: Routes = [
	{ path: '', component: LoginComponent, pathMatch: 'full', canActivate: [LoginGuardService] },
	{ path: 'chat', component: ChatComponent, canActivate: [AuthService] }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class RoutingModule {};