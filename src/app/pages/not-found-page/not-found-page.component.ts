import { Component, OnInit } from '@angular/core';
import { NotFoundPage } from '../../models/not-found-page.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-not-found-page',
    templateUrl: './not-found-page.component.html',
    styleUrls: ['./not-found-page.component.scss']
})
export class NotFoundPageComponent implements OnInit {

    content: NotFoundPage = {
        title: "Oops!",
        text: "<p>Something went wrong! </p><p>The page you are looking for could not be found! </p>",
    };

    constructor(
        private route: ActivatedRoute) {
        const error = this.route.snapshot.paramMap.get('error');
        this.message(error);
    }

    ngOnInit() {
    }

    message(error: string) {
        switch (error) {
            case 'network': {
                this.content.text = "<h2> Network Error! </h2><p>The page was unable to load due to a newtwork error. <br> The website might be down for maintenance or <br> there might be a problem with your local network connection. </p>";
                break;
            }
            default: {
                this.content.text = "<h2> Something went wrong! </h2><p>The page you are looking for could not be found! </p>";
                break;
            }
        }
    }

}
