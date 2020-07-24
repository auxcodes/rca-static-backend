import { Injectable } from '@angular/core';
import DirectusSDK, { LoginCredentials } from '@directus/sdk-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CmsAuthenticationService } from './cms-authentication.service';

import * as homeData from 'src/assets/static-content/json/home.json';
import * as aboutData from 'src/assets/static-content/json/about.json';
import * as siteSettingsData from 'src/assets/static-content/json/site_settings.json';
import * as contactData from 'src/assets/static-content/json/contact.json';
import * as menuData from 'src/assets/static-content/json/menu.json';
import * as footerData from 'src/assets/static-content/json/footer.json';
import * as seoData from 'src/assets/static-content/json/seo_settings.json';
import * as privacyData from 'src/assets/static-content/json/privacy.json';
import * as returnsPolicyData from 'src/assets/static-content/json/return_policy.json';
import * as contactLinksData from 'src/assets/static-content/json/contact_site_map_link.json';
import * as siteMapLinksData from 'src/assets/static-content/json/site_map_links.json';
import * as imagesData from 'src/assets/static-content/json/images.json';



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
                result = Promise.resolve(homeData.data);
                break;
            }
            case "site_settings": {
                result = Promise.resolve(siteSettingsData.data);
                break;
            }
            case "site_menu": {
                result = Promise.resolve(siteSettingsData.data);
                break;
            }
            case "contact": {
                result = Promise.resolve(contactData.data);
                break;
            }
            case "site_footer": {
                result = Promise.resolve(footerData.data);
                break;
            }
            case "seo_settings": {
                result = Promise.resolve(seoData.data);
                break;
            }
            case "about": {
                result = Promise.resolve(aboutData.data);
                break;
            }
            case "privacy": {
                result = Promise.resolve(privacyData.data);
                break;
            }
            case "return_policy": {
                result = Promise.resolve(returnsPolicyData.data);
                break;
            }
            case "image_file": {
                result = this.getImage(primaryKey);
                break;
            }
            default: {
                break;
            }
        }
        return result;
    }

    getItems(collection: string, params?: object): RequestPromise {
        let result = null;
        switch (collection) {
            case "site_menu_links": {
                result = this.getMenuItems(params);
                break;
            }
            case "seo_settings": {
                result = Promise.resolve(seoData.data);;
                break;
            }
            case "contact_site_map_link": {
                result = Promise.resolve(contactLinksData.data);
                break;
            }
            case "site_map_link": {
                result = this.getLinks(params);
                break;
            }
            case "artwork_directus_files": {
                result = this.getImages(params);
                break;
            }
            default: {
                break;
            }
        }
        return result;
    }

    async getMenuItems(params) {
        //console.log("Menu filter: ", params.filter);
        const ids: number[] = params.filter.id.in;
        const menu = ids.length === 0 ? menuData.data : menuData.data.filter(item => ids.includes(item.id));
        //console.log("Menu Items: ", menu);
        return menu;
    }

    async getSeoItem(id: number) {
        const seoItem = seoData.data.find(item => item.id === id);
        //console.log("SeoItem: ", seoItem);
        return seoItem;
    }

    async getLinks(params) {
        //console.log("Link filter: ", params.filter);
        const ids: number[] = params.filter.id.in;
        const links = ids.length === 0 ? siteMapLinksData.data : siteMapLinksData.data.filter(item => ids.includes(item.id));
        //console.log("LinkItems: ", links);
        return links;
    }

    async getImages(params) {
        //console.log("Image filter: ", params.filter);
        const ids: number[] = params.filter.artwork_id.eq;
        const images = ids.length === 0 ? imagesData.data : imagesData.data.filter(item => ids.includes(item.id));
        //console.log("Images: ", images);
        return images;
    }

    async getImage(id: number) {
        const image = imagesData.data.find(item => item.id === id);
        //console.log("Image File: ", id, image);
        return image;
    }
}
