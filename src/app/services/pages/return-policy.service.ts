import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReturnsPage } from '../../models/returns-page.model';
import { CmsClientService } from '../../services/cms/cms-client.service';
import { CmsItemsService } from '../../services/cms/cms-items.service';


@Injectable({
  providedIn: 'root'
})
export class ReturnPolicyService {

    returnsPage: BehaviorSubject<ReturnsPage> = new BehaviorSubject<ReturnsPage>({
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
        if (this.returnsPage.getValue().title === "") {
            try {
                this.returnsPageItems();
            }
            catch (error) { console.log("Error getting returns page content: ", error) };
        }
    }

    async returnsPageItems() {
        await this.cmsItems.getItem('return_policy', 1)
            .then((returns) => {
                let page: ReturnsPage = {
                    title: returns.data.title,
                    content: returns.data.content,
                    seoIndex: returns.data.seo_settings,
                    seo: undefined
                };
                this.returnsPage.next(page);
            })
            .catch(error => console.log('Error getting returns page items: ', error));
    }
}
