import { CMSImage } from './cms-image.model';
import { Seo } from './seo.model';

export interface SiteInfo {
    siteName: string;
    siteLogo: CMSImage;
    navLogo: CMSImage;
    url: string;
    seoIndex: number;
    seo: Seo;
}
