import { CMSImage } from './cms-image.model';
import { Seo } from './seo.model';

export interface AboutPage {
    title: string;
    text: string;
    imageIndex: number;
    image: CMSImage;
    seoIndex: number;
    seo: Seo;
}
