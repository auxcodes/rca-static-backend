import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CMSImage } from 'src/app/models/cms-image.model';
import { HomePage } from 'src/app/models/home-page.model';
import { CmsImageService } from '../../services/cms/cms-image.service';
import { CmsItemsService } from '../../services/cms/cms-items.service';
import { ArtworkCarouselService } from '../artwork-carousel.service';

@Injectable({
    providedIn: 'root'
})
export class HomePageService {

    content: BehaviorSubject<HomePage> = new BehaviorSubject<HomePage>({
        title: '',
        textBlockOne: '',
        textBlockTwo: '',
        carouselOne: undefined,
        carouselTwo: undefined,
        seoIndex: 0,
        seo: undefined
    });

    constructor(
        private cmsItems: CmsItemsService,
        private carouselService: ArtworkCarouselService) {
    }

    getContent() {
        if (this.content.value.carouselOne === undefined) {
            try {
                this.homePageItems();
            }
            catch (error) { console.log("Error getting home page content: ", error) };
        }
    }

    private async homePageItems() {
        await this.cmsItems.getItem('home', 1)
            .then(home => {
                const page: HomePage = {
                    title: home.title,
                    textBlockOne: home.text_area_one,
                    textBlockTwo: home.text_area_two,
                    carouselOne: undefined,
                    carouselTwo: undefined,
                    seoIndex: home.seo_settings,
                    seo: undefined
                };
                this.carouselService.carouselId('home_artwork_carousel')
                    .then(id => {
                        this.carouselService.getCarousel((id * 1))
                            .then(carousel => {
                                carousel.subscribe(data => {
                                    if (data !== undefined) {
                                        page.carouselOne = data;
                                        this.content.next(page);
                                    }
                                });
                            })
                            .catch(error => console.log("Error getting home artwork carousel", error));
                    }).catch(error => console.log("Error getting artwork carousel ids: ", error));
                this.carouselService.carouselId('home_image_carousel')
                    .then(id => {
                        this.carouselService.getCarousel(id)
                            .then(carousel => {
                                carousel.subscribe(data => {
                                    if (data !== undefined) {
                                        page.carouselTwo = data;
                                        this.content.next(page);
                                    }
                                });
                            })
                            .catch(error => console.log("Error getting home image carousel", error));
                    }).catch(error => console.log("Error getting image carousel ids: ", error));

                this.content.next(page);
            })
            .catch(error => console.log('Error getting home contents: ', error));
    }
}
