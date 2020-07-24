import { Injectable } from '@angular/core';
import { CmsItemsService } from './cms/cms-items.service';
import { BehaviorSubject } from 'rxjs';
import { Footer } from '../models/footer.model';
import { SiteLinksService } from './site-links.service';
import { Navbar } from '../models/navbar.model';
import { CmsImageService } from './cms/cms-image.service';
import { MenuItem } from '../models/menu-item.model';
import { SiteSettingsService } from './site-settings.service';

@Injectable({
    providedIn: 'root'
})
export class PagesService {

    footer: BehaviorSubject<Footer> = new BehaviorSubject<Footer>({
        title: '',
        text: '',
        links: [],
        groups: []
    });

    navbar: BehaviorSubject<Navbar> = new BehaviorSubject<Navbar>({
        logo: undefined,
        menuItems: []
    });

    constructor(
        private cmsItems: CmsItemsService,
        private siteSettings: SiteSettingsService,
        private siteLinkService: SiteLinksService) { }

    getNavbarLinks(): BehaviorSubject<Navbar> {
        if (this.navbar.value.logo === undefined) {
            try {
                this.menuItems();
            }
            catch (error) { console.log("Error getting nav bar content: ", error) };
        }
        return this.navbar;
    }

    getFooter(): BehaviorSubject<Footer> {
        if (this.footer.value.title === '') {
            try {
                this.footerItems();
            }
            catch (error) { console.log("Error getting footer content: ", error) };
        }
        return this.footer;
    }

    private async menuItems() {
        await this.cmsItems.getItem('site_menu', 1)
            .then(site => {
                const navbar: Navbar = { logo: undefined, menuItems: [] };
                navbar.menuItems = site;
                this.navbar.next(navbar);
                this.siteSettings.siteInfoImages(site.logo).then(image => navbar.logo = image);
                this.navbar.next(navbar);
            })
            .catch(error => console.log('Error getting menu items: ', error));
    }

    private async footerItems() {
        await this.cmsItems.getItem('site_footer', 1)
            .then(site => {
                const page: Footer = {
                    title: site.signup_title,
                    text: site.signup_text,
                    links: site.links,
                    groups: [],
                };
                this.footer.next(page);
            })
            .catch(error => console.log('Error getting footer contents: ', error));
    }
}
