import { Component, OnInit} from '@angular/core';
import { CMSImage } from '../../models/cms-image.model';
import { PagesService } from '../../services/pages.service';
import { SiteSettingsService } from '../../services/site-settings.service';

@Component({
    selector: 'app-burger-menu',
    templateUrl: './burger-menu.component.html',
    styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent implements OnInit{

    isOpen = false;
    burgerMenuClass = '';
    dropMenuClass = '';

    routerLinks = [];

    logoLink = '/home';
    firstLetter = '';
    siteName = '';
    logoImage: CMSImage;

    constructor(
        private pagesService: PagesService,
        private siteService: SiteSettingsService) {
        pagesService.getNavbarLinks().subscribe(navbar => {
            this.routerLinks = navbar.menuItems;
            this.logoImage = navbar.logo;
        });
    }

    ngOnInit() {
        this.siteService.content.subscribe(content => {
            this.firstLetter = content.siteName.charAt(0);
            this.siteName = content.siteName.substr(1);
        });    
    }

    onToggleMenu() {
        this.isOpen = !this.isOpen;
        this.burgerMenuClass = this.isOpen ? 'burger-open' : '';
        this.dropMenuClass = this.isOpen ? 'drop-open' : '';
        this.scrollListener(this.isOpen);
    }

    scrollListener(addEvent: boolean) {
        if (addEvent) {
            window.addEventListener('scroll', this.scrollEvent, true);
        }
        else {
            window.removeEventListener('scroll', this.scrollEvent, true);
        }
    }

    scrollEvent = (): void => {
        if (this.isOpen) {
            this.onToggleMenu();
        }
    }

}
