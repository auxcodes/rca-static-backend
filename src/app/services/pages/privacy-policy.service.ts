import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PrivacyPage } from '../../models/privacy-page.model';
import { CmsClientService } from '../../services/cms/cms-client.service';
import { CmsItemsService } from '../../services/cms/cms-items.service';

@Injectable({
    providedIn: 'root'
})
export class PrivacyPolicyService {

    privacyPage: BehaviorSubject<PrivacyPage> = new BehaviorSubject<PrivacyPage>({
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
        if (this.privacyPage.getValue().title === "") {
            try {
                this.privacyPageItems();
            }
            catch (error) { console.log("Error getting privacy page content: ", error) };
        }
    }

    async privacyPageItems() {
        await this.cmsItems.getItem('privacy', 1)
            .then((privacy) => {
                const page: PrivacyPage = {
                    title: privacy.title,
                    content: privacy.content,
                    seoIndex: privacy.seo_settings,
                    seo: undefined
                };
                this.privacyPage.next(page);
            })
            .catch(error => console.log('Error getting privacy page items: ', error));
    }
}
