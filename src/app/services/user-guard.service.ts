import { Injectable } from '@angular/core';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    NavigationExtras,
    CanLoad, Route
} from '@angular/router';

import { AuthenticationService } from './authentication.service';

@Injectable({
    providedIn: 'root'
})
export class UserGuardService implements CanActivate, CanActivateChild, CanLoad {

    private checkLogin(url: string): boolean {

        if (this.authService.userIsAuthenicated) {
            return true;
        } else {

            // Navigate to the login page with extras
            this.router.navigate(['/sign-in']);

            return false;
        }

    }

    constructor(private authService: AuthenticationService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const url: string = state.url;

        return this.checkLogin(url);

    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        return this.canActivate(route, state);

    }

    canLoad(route: Route): boolean {

        const url = `/${route.path}`;

        return this.checkLogin(url);

    }

}
