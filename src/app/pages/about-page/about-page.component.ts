import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { AboutPage } from 'src/app/models/about-page.model';
import { AboutPageService } from 'src/app/services/pages/about-page.service';
import { SeoService } from '../../services/seo.service';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';
import { Seo } from '../../models/seo.model';



@Component({
    selector: 'app-about-page',
    templateUrl: './about-page.component.html',
    styleUrls: ['./about-page.component.scss']
})
export class AboutPageComponent implements OnInit, OnDestroy {

    content: AboutPage = {
        title: "About Us",
        text: "",
        imageIndex: undefined,
        image: undefined,
        seoIndex: 0,
        seo: undefined
    };

    constructor(
        private titleService: Title,
        private sanitizer: DomSanitizer,
        private aboutPage: AboutPageService,
        private seoService: SeoService,
        private fbSdkService: FacebookSdkService) {
    }

    ngOnInit() {
        this.aboutPage.getContent();
        this.aboutPage.content.subscribe((data) => {
            if (data.text !== '') {
                this.content = data;
                this.titleService.setTitle(this.content.title);
                this.seoService.setMetaTags(this.content.seoIndex).then(seo => {
                    this.setupFacebookShare(seo);
                });
            }
        });
    }

    ngOnDestroy() {
        this.fbSdkService.resetShareButton();
    }

    contentText() {
        return this.sanitizer.bypassSecurityTrustHtml(this.content.text);
    }

    private setupFacebookShare(seo: Seo) {
        this.fbSdkService.sdkSettings.subscribe(sdkData => {
            if (sdkData.appId !== '') {
                this.fbSdkService.setShareButton({
                    dataShare: true,
                    dataWidth: '',
                    dataShowFaces: true,
                    dataLayout: 'button_count',
                    dataSize: 'small',
                    dataHref: 'https://rca.aux.codes/about',
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes/about',
                    ogType: 'website',
                    ogTitle: seo.title,
                    ogDescription: seo.description,
                    ogImage: 'https://api.risecommunityart.com.au/uploads/_/originals/logo-medium-784w.png',
                    ogImageAlt: 'RISE Community Art Logo',
                });
            }
        });
    }

}
