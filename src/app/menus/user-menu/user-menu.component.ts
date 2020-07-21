import { Component, OnInit, NgZone } from '@angular/core';
import { SnipcartService } from '../../services/snipcart.service';
import { fromEvent } from 'rxjs';

@Component({
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
    isOpen = false;
    dropMenuClass = '';
    userProfileClass = '';
    isLoggedIn = false;

    constructor(private snipcart: SnipcartService) {
        snipcart.isLoggedIn.subscribe((value) => {
            this.isLoggedIn = value;
            this.userProfileClass = value ? '' : 'logged-out snipcart-user-profile';
        });
    }

    ngOnInit() {
    }

    onToggleMenu() {
        this.isOpen = !this.isOpen;
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
