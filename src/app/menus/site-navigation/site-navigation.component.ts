import { Component, OnInit } from '@angular/core';
import { PagesService } from '../../services/pages.service';

@Component({
    selector: 'app-site-navigation',
    templateUrl: './site-navigation.component.html',
    styleUrls: ['./site-navigation.component.scss']
})
export class SiteNavigationComponent implements OnInit {

    routerLinks = [];

    constructor(private pagesService: PagesService) {
        pagesService.getNavbarLinks().subscribe(navbar => {
            this.routerLinks = navbar.menuItems;
        });
    }

    ngOnInit() {
    }

}
