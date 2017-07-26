// Exposes main routing logic
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { TooMuchTabsComponent } from './toomuchtabs/toomuchtabs.component';
import { NotFoundComponent } from './notfound/notfound.component';
import { AuthService } from './services/auth.service';
import { LoginGuardService } from './services/loginguard.service';

const routes: Routes = [
	{ path: '', component: LoginComponent, pathMatch: 'full', canActivate: [LoginGuardService] },
	{ path: 'chat', component: ChatComponent, canActivate: [AuthService] },
	{ path: 'toomuchtabs', component: TooMuchTabsComponent, canActivate: [AuthService] },
	{ path: '**', component: NotFoundComponent },
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class RoutingModule {};