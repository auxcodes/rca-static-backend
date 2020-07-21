import { Component, OnInit } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { PrivacyPage } from '../../models/privacy-page.model';
import { PrivacyPolicyService } from '../../services/pages/privacy-policy.service';
import { SeoService } from '../../services/seo.service';


@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

    privacy: PrivacyPage = {
        title: 'Privacy Policy',
        content: '',
        seoIndex: 0,
        seo: undefined
    };

    constructor(
        private titleService: Title,
        private sanitizer: DomSanitizer,
        private privacyService: PrivacyPolicyService,
        private seoService: SeoService) { }

    ngOnInit() {
        this.privacyService.getContent();
        this.privacyService.privacyPage.subscribe((data) => {
            if (data.content !== '') {
                this.privacy = data;
                this.titleService.setTitle(this.privacy.title);
                this.seoService.setMetaTags(data.seoIndex);
            }
        });
    }

    privacyContent() {
        return this.sanitizer.bypassSecurityTrustHtml(this.privacy.content);
    }

}
