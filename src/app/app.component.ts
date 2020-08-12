import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SnipcartService } from './services/snipcart.service';
import { DemoSiteModalService } from './services/utils/demo-site-modal.service';

declare var gtag;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    siteWarning = "<h1>Archived Website</h1><p>This site is an archived version of the <a href=\"https://risecommunityart.com.au\">Rise Community Art</a> website.</p><p>Artwork on this website cannot be purchased here, however, it may still be available for purchase from <a href=\"https://risecommunityart.com.au\">Rise Community Art</a>. </p>";
    showModal = true;

    constructor(
        private router: Router,
        private snipcart: SnipcartService,
        private visitHistory: DemoSiteModalService
        ) {
        this.snipcartScript();
        this.googleTracking();
        visitHistory.isModalShown.subscribe(value => {
            this.showModal = value;
            console.log("Show modal value updated: ", value);
        });
        visitHistory.visitHistory.subscribe(history => {
            visitHistory.isModalShown.next(history.seenNotification ? false : true);
        });
    }

    snipcartScript() {
        //this.snipcart.addScript();
        this.snipcart.addCartReadyListener();
    }

    googleTracking() {
        const navEndEvents = this.router.events.pipe(
            filter(
                event => event instanceof NavigationEnd
            )
        );
        navEndEvents.subscribe(
            (event: NavigationEnd) => {
                gtag('config', 'UA-147555295-1', {
                    page_path: event.urlAfterRedirects
                })
            }
        )
    }

    closeModal() {
        this.visitHistory.isModalShown.next(false);
        this.visitHistory.saveHistory();
    }
}
