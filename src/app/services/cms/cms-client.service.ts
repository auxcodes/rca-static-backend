import { Injectable } from '@angular/core';
import DirectusSDK, { LoginCredentials } from '@directus/sdk-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CmsAuthenticationService } from './cms-authentication.service';

@Injectable({
    providedIn: 'root'
})
export class CmsClientService {

    client: DirectusSDK = new DirectusSDK({
        url: environment.cmsUrl,
        project: environment.cmsProject,
        storage: sessionStorage
    });
    isCmsReady: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private authService: CmsAuthenticationService) {
    }

    async login(credentials: LoginCredentials) {
        await this.authService.login(this.client, credentials)
            .then(() => {
                this.isCmsReady.next(this.client.loggedIn);
            })
            .catch(error => console.error('Error logging in: ', error));
    }

    logout() {
        this.authService.logout(this.client);
    }

    isLoggedIn() {
        const loggedIn = this.authService.isLoggedIn();
        if (!loggedIn) {
            this.logout();
        }
        return loggedIn;
    }
}
