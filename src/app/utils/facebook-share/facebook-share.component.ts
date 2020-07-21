import { Component, OnInit, Input } from '@angular/core';
import { FacebookShare } from '../../models/facebook-share.model';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';

@Component({
    selector: 'app-facebook-share',
    templateUrl: './facebook-share.component.html',
    styleUrls: ['./facebook-share.component.scss']
})
export class FacebookShareComponent implements OnInit {

    fbShareData: FacebookShare = {
        dataShare: true,
        dataWidth: '',
        dataShowFaces: true,
        dataLayout: 'button_count',
        dataSize: 'small',
        dataHref: 'https://rca.aux.codes',
        showShare: true
    }

    showShare = false;

    constructor(private fbSdkService: FacebookSdkService) { }

    ngOnInit(): void {
        this.fbSdkService.shareSettings.subscribe(shareData => {
            this.fbShareData = shareData;
        });
    }
}
