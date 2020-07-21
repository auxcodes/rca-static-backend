import { Component, OnInit } from '@angular/core';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { ReturnsPage } from '../../models/returns-page.model';
import { CmsClientService } from '../../services/cms/cms-client.service';
import { ReturnPolicyService } from '../../services/pages/return-policy.service';
import { SeoService } from '../../services/seo.service';


@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.scss']
})
export class ReturnsComponent implements OnInit {

    returns: ReturnsPage = {
        title: 'Return Policy',
        content: '',
        seoIndex: 0,
        seo: undefined
    };

    constructor(
        private cmsClient: CmsClientService,
        private returnsService: ReturnPolicyService,
        private sanitizer: DomSanitizer,
        private titleService: Title,
        private seoService: SeoService) {
    }

    ngOnInit() {
        this.returnsService.getContent();
        this.returnsService.returnsPage.subscribe((data) => {
            if (data.content !== '') {
                this.returns = data;
                this.titleService.setTitle(this.returns.title);
                this.seoService.setMetaTags(data.seoIndex);
            }
        });
    }

    returnsContent() {
        return this.sanitizer.bypassSecurityTrustHtml(this.returns.content);
    }
}
