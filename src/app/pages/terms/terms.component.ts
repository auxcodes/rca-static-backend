import { Component, OnInit } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { TermsPage } from '../../models/terms-page.model';
import { CmsClientService } from '../../services/cms/cms-client.service';
import { TermsConditionsService } from '../../services/pages/terms-conditions.service';
import { SeoService } from '../../services/seo.service';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

    terms: TermsPage = {
        title: 'Terms and Conditions',
        content: '',
        seoIndex: 0,
        seo: undefined
    };

    constructor(
        private cmsClient: CmsClientService,
        private termsService: TermsConditionsService,
        private sanitizer: DomSanitizer,
        private titleService: Title,
        private seoService: SeoService) {
    }

    ngOnInit() {
        this.termsService.getContent();
        this.termsService.termsPage.subscribe((data) => {
            if (data.content !== '') {
                this.terms = data;
                this.titleService.setTitle(this.terms.title);
                this.seoService.setMetaTags(data.seoIndex);
            }
        });
    }

    termsContent() {
        return this.sanitizer.bypassSecurityTrustHtml(this.terms.content);
    }
}
