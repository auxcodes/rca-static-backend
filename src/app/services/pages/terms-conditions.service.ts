import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TermsPage } from '../../models/terms-page.model';
import { CmsClientService } from '../../services/cms/cms-client.service';
import { CmsItemsService } from '../../services/cms/cms-items.service';


@Injectable({
    providedIn: 'root'
})
export class TermsConditionsService {

    termsPage: BehaviorSubject<TermsPage> = new BehaviorSubject<TermsPage>({
        title: '',
        content: '',
        seoIndex: 0,
        seo: undefined
    });

    constructor(
        private cmsClient: CmsClientService,
        private cmsItems: CmsItemsService) {

    }

    getContent() {
        if (this.termsPage.getValue().title === "") {
            try {
                this.termsPageItems();
            }
            catch (error) { console.log("Error getting terms page content: ", error) };
        }
    }

    async termsPageItems() {
        await this.cmsItems.getItem('terms', 1)
            .then((terms) => {
                let page: TermsPage = {
                    title: terms.data.title,
                    content: terms.data.content,
                    seoIndex: terms.data.seo_settings,
                    seo: undefined
                };
                this.termsPage.next(page);
            })
            .catch(error => console.log('Error getting terms page items: ', error));
    }
}
