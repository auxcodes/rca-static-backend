import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CMSImage } from 'src/app/models/cms-image.model';
import { SiteInfo } from 'src/app/models/site-info.model';
import { Seo } from '../models/seo.model';
import { CmsImageService } from './cms/cms-image.service';
import { CmsItemsService } from './cms/cms-items.service';
import { SeoService } from './seo.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {

    content: BehaviorSubject<SiteInfo> = new BehaviorSubject<SiteInfo>({
        siteName: '',
        siteLogo: undefined,
        url: '',
        seoIndex: 0,
        seo: undefined,
    });

    private maxLogoSize = 86;
    private logoQuality = 'okay';

    constructor(
        private cmsItems: CmsItemsService,
        private cmsImage: CmsImageService,
        private seoService: SeoService,
        private router: Router) {
        this.getContent();
    }

    getContent() {
        if (this.content.getValue().siteLogo === undefined) {
            try {
                this.siteInfoItems();
            }
            catch (error) { console.log("Error getting info page content: ", error) };
        }
    }

    async siteInfoItems() {
        await this.cmsItems.getItem('site_settings', 1)
            .then(info => {
                const site: SiteInfo = {
                    siteName: info.website_name,
                    siteLogo: undefined,
                    url: info.url,
                    seoIndex: info.global_seo_settings,
                    seo: undefined
                };
                this.content.next(info);
                this.seoSettings(info.global_seo_settings).then(seo => site.seo = seo);
                this.siteInfoImages(info.site_logo)
                    .then(image => {
                        site.siteLogo = image;
                        this.content.next(site);
                    });
            })
            .catch(error => {
                console.log('Error getting site info contents: ', error)
                if (error.message === 'Network Error') {
                    console.log('Network Error: ', error.message);
                    this.router.navigate(['not-found/network']);
                }

            });
    }

    async siteInfoImages(imageIndex: number) {
        let imageData: CMSImage;
        await this.cmsImage.getImage(imageIndex)
            .then(image => {
                imageData = image;
                imageData.thumbnailUrl = this.cmsImage.resizeImageUrl(imageData.filename, this.maxLogoSize, this.logoQuality);
            })
            .catch(error => console.log('Error getting site info images: ', error));
        return imageData;
    }

    async seoSettings(seoIndex: number) {
        let seo: Seo;
        await this.seoService.seoItem(seoIndex)
            .then(item => seo = item)
            .catch(error => console.log('Error getting site info seo: ', error));
        return seo;
    }
}
