import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AboutPage } from 'src/app/models/about-page.model';
import { CMSImage } from 'src/app/models/cms-image.model';
import { CmsImageService } from '../../services/cms/cms-image.service';
import { CmsItemsService } from '../../services/cms/cms-items.service';


@Injectable({
    providedIn: 'root'
})
export class AboutPageService {

    content: BehaviorSubject<AboutPage> = new BehaviorSubject<AboutPage>({
        title: "",
        text: "",
        imageIndex: undefined,
        image: undefined,
        seoIndex: 0,
        seo: undefined
    });

    constructor(
        private cmsItems: CmsItemsService,
        private cmsImage: CmsImageService) {

    }

    getContent() {
        if (this.content.getValue().image === undefined) {
            try {
                this.aboutPageItems();
            }
            catch (error) { console.log("Error getting about page content: ", error) };
        }
    }

    async aboutPageItems() {
        await this.cmsItems.getItem('about', 1)
            .then((about) => {
                let page: AboutPage = {
                    title: about.data.title,
                    text: about.data.text_area,
                    imageIndex: about.data.image,
                    image: undefined,
                    seoIndex: about.data.seo_settings,
                    seo: undefined
                };
                this.aboutPageImages(page.imageIndex).then(image => page.image = image);
                this.content.next(page);
            })
            .catch(error => console.log('Error getting about contents: ', error));
    }

    async aboutPageImages(imageIndex: number) {
        let imageUrl: CMSImage;
        await this.cmsImage.getImage(imageIndex)
            .then(image => imageUrl = image)
            .catch(error => console.log('Error getting about images: ', error));
        return imageUrl;
    }
}
