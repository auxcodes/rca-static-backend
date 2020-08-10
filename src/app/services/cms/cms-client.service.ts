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
import * as artistPageData from 'src/assets/static-content/json/artists_page.json';
import * as artistProfileData from 'src/assets/static-content/json/artist_profiles.json';
import * as galleryPageData from 'src/assets/static-content/json/gallery.json';
import * as artworkData from 'src/assets/static-content/json/artwork.json';
import * as blogPageData from 'src/assets/static-content/json/blog_page.json';
import * as blogPostsData from 'src/assets/static-content/json/blog_posts.json';

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
            case "artists_page": {
                result = Promise.resolve(artistPageData.data);
                break;
            }
            case "artist_profiles": {
                result = this.getArtist(primaryKey);
                break;
            }
            case "gallery": {
                result = Promise.resolve(galleryPageData.data);
                break;
            }
            case "image_file": {
                result = this.getImage(primaryKey);
                break;
            }
            case "artwork": {
                result = this.getArtwork(primaryKey);
                break;
            }
            case "blog_page": {
                result = Promise.resolve(blogPageData.data);
                break;
            }
            case "blog_posts": {
                result = this.getBlogPost(primaryKey);
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
            case "artists_page_artist_profiles": {
                result = this.getArtistIds();
                break;
            }
            case "artist_profiles": {
                result = this.getArtistProfiles(params);
                break;
            }
            case "gallery_artwork": {
                result = this.getArtworkIds();
                break;
            }
            case "artwork": {
                result = this.getArtwork(params);
                break;
            }
            case "blog_page_blog_posts": {
                result = this.getBlogIds();
                break;
            }
            case "blog_posts": {
                result = Promise.resolve(blogPostsData.data);
                break;
            }
            default: {
                break;
            }
        }
        return result;
    }

    async getArtworkIds() {
        const ids: number[] = artworkData.data.map(item => {
            return item.id
        });
        //console.log("CS Artwork Ids: ", ids);
        return ids;
    }

    async getArtwork(params) {
        //console.log("CS Artwork Params:", params);
        const offset = params.offset ? params.offset : 0;
        const limit = params.limit ? params.limit + offset : 100;
        const sort = params.sort ? params.sort : null;
        let artwork: any[] = [];
        artworkData.data.forEach(item => {
            //console.log(item);
            if (item.visible === params.filter.visible.neq) {
                artwork.push(item);
            }
        });
        artwork = sort ? artwork.sort((a, b) => { return a.sold - b.sold }) : artwork;
        artwork = artwork.slice(offset, limit);
        //console.log("CS Artwork items: ", artwork);
        return artwork;
    }

    async getBlogIds() {
        const ids: number[] = blogPostsData.data.map(item => {
            return item.id
        });
        //console.log("CS Blog Post Ids: ", ids);
        return ids;
    }

    async getBlogPost(id: number) {
        const post = blogPostsData.data.find(item => item.id === id);
        //console.log("CS Get Blog Post: ", id, post);
        return post;
    }

    async getBlogPosts(params) {
        //console.log("CS Blog Post Params:", params);
        const offset = params.offset ? params.offset : 0;
        const limit = params.limit ? params.limit + offset : 100;
        const sort = params.sort ? params.sort : null;

        let posts: any[] = [];
        blogPostsData.data.forEach(item => {
            //console.log(item);
            if (item.status === params.filter.status.eq) {
                posts.push(item);
            }
        });
        posts = sort ? posts.sort((a, b) => { return a.sold - b.sold }) : posts;
        posts = posts.slice(offset, limit);
        //console.log("CS Post items: ", posts);
        return posts;
    }

    async getArtistIds() {
        const ids: number[] = artistProfileData.data.map(item => {
            return item.id
        });
        //console.log("Artist Ids: ", ids);
        return ids;
    }

    async getArtistProfiles(params) {
        //console.log("Artist Params:", params);
        const profiles: object[] = [];
        artistProfileData.data.forEach(item => {
            //console.log(item);
            if (item.visible === params.filter.visible.neq) {
                profiles.push(item);
            }
        });
        //console.log("Artist Profiles: ", profiles);
        return profiles;
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
        const id = params.filter.artwork_id.eq;
        const images = id ? imagesData.data.filter(item => item.id === id) : imagesData.data;
        //console.log("CS Get Images: ", images);
        return images;
    }

    async getImage(id: number) {
        const image = imagesData.data.find(item => item.id === id);
        //console.log("CS Get Image: ", id, image);
        return image;
    }

    async getArtist(id: number) {
        const artist = artistProfileData.data.find(item => item.id === id);
        //console.log("CS Get Artist: ", id, artist);
        return artist;
    }
}
