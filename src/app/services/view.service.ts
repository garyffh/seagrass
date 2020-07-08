import { Injectable } from '@angular/core';
import { AuthenticationService } from '~/app/services/authentication.service';
import { RouterExtensions } from 'nativescript-angular';

@Injectable({
    providedIn: 'root'
})
export class ViewService {

    private fWorkingProcessCount = 0;

    constructor(public authenticationService: AuthenticationService,
                public routerExtensions: RouterExtensions) {
    }

    addWorkingProcess(): void {
        this.fWorkingProcessCount++;
    }

    removeWorkingProcess(): void {
        this.fWorkingProcessCount--;
    }

    get showSpinner(): boolean {
        return this.fWorkingProcessCount > 0;
    }

    signOut(): void {

        if (this.authenticationService.userIsAuthenicated) {
            this.authenticationService.logoutUser();
            this.routerExtensions.navigate(['sign-in'], {replaceUrl: false});
        }
    }
}
