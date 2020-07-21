import { Component, OnInit } from '@angular/core';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';

@Component({
    selector: 'app-facebook-sdk',
    templateUrl: './facebook-sdk.component.html',
    styleUrls: ['./facebook-sdk.component.scss']
})
export class FacebookSdkComponent implements OnInit {

    constructor(private fbSdkService: FacebookSdkService) { }

    ngOnInit(): void {
        this.fbSdkService.getSdkSettings().then(done => {
            if (done) {
                this.fbSdkService.sdkSettings.subscribe(settings => {
                    if (settings.appId !== '') {
                        this.fbSdkService.addSDK(settings);
                    }
                });
            }
        });
    }
}
