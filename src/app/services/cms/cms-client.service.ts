import { Injectable } from '@angular/core';
import DirectusSDK, { LoginCredentials } from '@directus/sdk-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CmsAuthenticationService } from './cms-authentication.service';

import * as homeData from 'src/assets/static-content/json/home.json';
import * as siteSettingsData from 'src/assets/static-content/json/site_settings.json';
import * as contactData from 'src/assets/static-content/json/contact.json';
import * as menuData from 'src/assets/static-content/json/menu.json';
import * as footerData from 'src/assets/static-content/json/footer.json';



export declare type RequestPromise = Promise<any>;

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

    getItem(collection: string, primaryKey: number, params?: object): RequestPromise {
        let result = null;
        switch (collection) {
            case "home": {
                result = this.getHomeData();
                break;
            }
            case "site_settings": {
                result = this.getSiteSettingsData();
                break;
            }
            case "contact": {
                result = this.getContactData();
                break;
            }
            case "site_menu": {
                result = this.getSiteMenuData();
                break;
            }
            case "site_footer": {
                result = this.getSiteFooterData();
                break;
            }
            case "": {

                break;
            }
            default: {
                break;
            }
        }
        return result;
    }

    async getHomeData() {
        console.log("HomeData: ", homeData.data);
        return homeData.data;
    }

    async getSiteSettingsData() {
        console.log("SiteSettingsData: ", siteSettingsData.data);
        return siteSettingsData.data;
    }

    async getContactData() {
        console.log("ContactData: ", contactData.data);
        return contactData.data;
    }

    async getSiteMenuData() {
        console.log("MenuData: ", menuData.data);
        return menuData.data;
    }

    async getSiteFooterData() {
        console.log("FooterData: ", footerData.data);
        return footerData.data;
    }

}
