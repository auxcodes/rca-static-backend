import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import DirectusSDK from '@directus/sdk-js';
import { CmsClientService } from '../../services/cms/cms-client.service';
import { ManageLink } from '../../models/manage-link.model';
import { SiteLinksService } from '../../services/site-links.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

    client: DirectusSDK = new DirectusSDK({
        url: '',
        project: ''
    });

    title = 'Sign In';
    email: string;
    password: string;
    errorMsg: string;

    manageLinks: ManageLink[] = [];
    user: User = { name: 'loading...', email: 'loading...' };
    loggedIn = false;

    constructor(private ngZone: NgZone,
        private clientService: CmsClientService,
        private router: Router,
        private titleService: Title,
        private siteLinks: SiteLinksService) {

    }

    ngOnInit() {
        this.loggedIn = this.clientService.isLoggedIn();
        if (this.loggedIn) {
            this.userDetails();
            this.getLinks();
        }
        this.titleService.setTitle(this.title);
    }

    ngOnDestroy() {
        this.signOut();
    }

    userDetails() {
        this.clientService.client.getMe({ fields: 'first_name, email'})
            .then(results => {
                this.user.name = results.data.first_name;
                this.user.email = results.data.email;
            });
    }


    signIn() {
        this.clientService.login({ email: this.email, password: this.password })
            .then(() => {
                this.password = '';
                this.getLinks();
                this.userDetails();
            })
            .catch(() => {
                this.errorMsg = 'Admin login attempt was unsuccessful';
            });
    }

    signOut() {
        this.title = 'Sign In';
        this.titleService.setTitle(this.title);
        this.clientService.logout();
        this.loggedIn = false;
    }

    private getLinks() {
        this.siteLinks.manageLinks()
            .then(result => {
                this.manageLinks = result;
                this.title = 'Site Management';
                this.titleService.setTitle(this.title);
                this.loggedIn = true;
            })
            .catch(error => console.log('Error getting navigation content: ', error));
    }

    openUrl(url: string) {
        window.open(url, '_blank');
    }

    openPath(path: string) {
        const url = this.router.serializeUrl(this.router.createUrlTree([path]));
        window.open(url, '_blank');
    }
}
