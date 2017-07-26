// Login Guard Service
// activates Chat if user is logged in
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class LoginGuardService implements CanActivate {
	
	constructor(public userService: UserService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.userService.isLoggedIn() === true) {
			this.router.navigate(['/chat']);
			return false;
		}
		return true;
	}

}