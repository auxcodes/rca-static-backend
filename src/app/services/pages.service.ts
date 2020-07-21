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
                let navbar: Navbar = { logo: undefined, menuItems: [] };
                this.getMenuItemsIds().then(ids => {
                    this.getMenuItems(ids).then(items => {
                        navbar.menuItems = items;
                        this.navbar.next(navbar);
                    });
                });
                this.siteSettings.siteInfoImages(site.data.logo).then(image => navbar.logo = image);
                this.navbar.next(navbar);
            })
            .catch(error => console.log('Error getting menu items: ', error));
    }

    private async getMenuItemsIds() {
        let result: string = '';
        await this.cmsItems.getItems('site_menu_site_menu_links', { fields: 'site_menu_links_id' })
            .then(ids => {
                ids.data.forEach(id => {
                    result = result.concat(id.site_menu_links_id + ', ');
                });
            })
            .catch(error => console.log('Error getting site menu link ids: ', error));
        return result;
    }

    private async getMenuItems(ids: string): Promise<MenuItem[]> {
        let result: MenuItem[] = [];
        await this.cmsItems.getItems('site_menu_links', { sort: 'position', filter: { id: { in: ids } } })
            .then(items => {
                result = items.data;
            })
        return result;
    }

    private async footerItems() {
        await this.cmsItems.getItem('site_footer', 1)
            .then(site => {
                let page: Footer = {
                    title: site.data.signup_title,
                    text: site.data.signup_text,
                    links: site.data.links,
                    groups: [],
                };
                this.siteLinkService.getLinkIds('site_footer_site_map_link', 'site_map_link_id').then(data => {
                    this.siteLinkService.siteLinks(data).then(links => {
                        page.links = links;
                        this.footer.next(page);
                        this.siteLinkService.linkGroups(page.links).then(groups => {
                            page.groups = groups;
                            this.footer.next(page);
                        });
                    });
                });
                this.footer.next(page);
            })
            .catch(error => console.log('Error getting footer contents: ', error));
    }
}
