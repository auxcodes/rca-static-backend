import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { HomePage } from 'src/app/models/home-page.model';
import { HomePageService } from 'src/app/services/pages/home-page.service';
import { SeoService } from '../../services/seo.service';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';
import { Seo } from '../../models/seo.model';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy {

    homePage: HomePage = {
        title: '',
        textBlockOne: '',
        textBlockTwo: '',
        carouselOne: undefined,
        carouselTwo: undefined,
        seoIndex: 0,
        seo: undefined
    };

    options: object = { timing: '1000ms ease-in-out', autoScrollTiming: 3000, autoScroll: true, showControls: true, spacing: 5 };

    constructor(
        private titleService: Title,
        private sanitizer: DomSanitizer,
        private homePageService: HomePageService,
        private seoService: SeoService,
        private fbSdkService: FacebookSdkService) {
    }

    ngOnInit() {
        this.homePageService.getContent();
        this.homePageService.content.subscribe(data => {
            if (data.textBlockOne !== '') {
                this.homePage = data;
                this.titleService.setTitle(this.homePage.title);
                this.seoService.setMetaTags(this.homePage.seoIndex).then(seo => {
                    this.setupFacebookShare(seo);
                });
            }
        });
    }

    ngOnDestroy() {
        this.fbSdkService.resetShareButton();
    }

    homePageContent(content: string) {
        return this.sanitizer.bypassSecurityTrustHtml(content === 'textBlockOne' ? this.homePage.textBlockOne : this.homePage.textBlockTwo);
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
                    dataHref: 'https://rca.aux.codes',
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes',
                    ogType: 'website',
                    ogTitle: seo.title,
                    ogDescription: seo.description,
                    ogImage: 'assets/static-content/images/logo-medium-784w.png',
                    ogImageAlt: 'RISE Community Art Logo',
                });
            }
        });
    }
}

