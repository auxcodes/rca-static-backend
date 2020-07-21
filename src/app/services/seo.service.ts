import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Seo } from '../models/seo.model';
import { CmsItemsService } from './cms/cms-items.service';


@Injectable({
    providedIn: 'root'
})
export class SeoService {

    private allSeo: Seo[] = [];

    constructor(
        private cmsItems: CmsItemsService,
        private metaService: Meta) { }

    getAllSeo() {
        if (this.allSeo.length === 0) {
            try {
                this.seoItems();
            }
            catch (error) { console.log("Error getting SEO content: ", error) };
        }
    }

    async seoItems() {
        await this.cmsItems.getItems('seo_settings')
            .then((results) => {
                let seos: Seo[] = results.data.map(item => {
                    let seo: Seo = {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        keywords: item.keyword
                    }
                    return seo;
                })
                this.allSeo = seos;
            })
            .catch(error => console.log('Error getting SEO items: ', error));
    }

    async seoItem(seoIndex: number): Promise<Seo> {
        let seo: Seo;

        if (this.allSeo.length > 0) {
            seo = this.findById(seoIndex);
        }
        else {
            if (seoIndex !== 0) {
                await this.cmsItems.getItem('seo_settings', seoIndex)
                    .then((item) => {
                        seo = {
                            id: item.data.id,
                            title: item.data.title,
                            description: item.data.description,
                            keywords: item.data.keywords ? item.data.keywords : ''
                        }
                    })
                    .catch(error => console.log('Error getting SEO item: ', error))
            }
        }

        return seo;
    }

    private findById(seoId: number): Seo {
        let result: Seo;
        this.allSeo.find(seo => {
            if (seo.id === seoId)
                result = seo;
        });
        return result;
    }

    async setMetaTags(seoIndex: number): Promise<Seo> {
        let seoData: Seo = undefined;
        await this.seoItem(seoIndex).then(seo => {
            this.metaService.updateTag({ name: 'keywords', content: seo.keywords.toLowerCase() });
            this.metaService.updateTag({ name: 'description', content: seo.description });
            this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
            seoData = seo;
        });
        return seoData;
    }

    async setMetaTagsWithSeo(seo: Seo) {
        this.metaService.updateTag({ name: 'keywords', content: seo.keywords });
        this.metaService.updateTag({ name: 'description', content: seo.description });
        this.metaService.updateTag({ name: 'robots', content: 'index, follow' });
    }
}
