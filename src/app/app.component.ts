import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SnipcartService } from './services/snipcart.service';


declare var gtag;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        private router: Router,
        private snipcart: SnipcartService,
        ) {
        this.snipcartScript()
        this.googleTracking();
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
}
