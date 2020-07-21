import { Seo } from './seo.model';
import { ArtworkCarousel } from './artwork-carousel.model';

export interface HomePage {
    title: string;
    textBlockOne: string;
    textBlockTwo: string;
    carouselOne: ArtworkCarousel;
    carouselTwo: ArtworkCarousel;
    seoIndex: number;
    seo: Seo;
}
