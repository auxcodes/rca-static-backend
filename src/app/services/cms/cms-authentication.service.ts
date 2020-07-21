import { Injectable } from '@angular/core';
import DirectusSDK, { LoginCredentials } from '@directus/sdk-js';
import { BehaviorSubject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class CmsAuthenticationService {

    constructor() { }

    async login(client: DirectusSDK, options: LoginCredentials) {
        try {
            return client.login(options);
        }
        catch (error) {
            console.error('Unable to login to CMS: ', error);
        }
    }

    async signIn(client: DirectusSDK, options: LoginCredentials) {
        try {
            return client.login(options);
        }
        catch (error) {
            console.error('Unable to login to CMS: ', error);
        }
    }

    logout(client: DirectusSDK) {
        client.logout();
    }

    isLoggedIn() {
        return this.getExpiration();
    }

    private getExpiration() {
        const session = sessionStorage.getItem("directus-sdk-js");
        if (session) {
            const expiration = JSON.parse(session).localExp;
            const current = Date.now();
            return current < expiration;
        }
        return false;
    }   
}
