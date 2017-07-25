import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class AuthService implements CanActivate {
	
	constructor(public userService: UserService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		if (this.userService.isLoggedIn() === true) {
			return true;
		}
		this.router.navigate(['']);
		return false;
	}

}