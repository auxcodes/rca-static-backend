import { CMSImage } from './cms-image.model';
import { Seo } from './seo.model';

export interface SiteSettings {
    name: string;
    logoIndex: number;
    siteLogo: CMSImage;
    seoIndex: number;
    seo: Seo;
}
