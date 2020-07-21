import { Seo } from './seo.model';
import { SiteMapLink } from './site-map-link.model';

export interface Contact {
    title: string;
    contactText: string;
    email: string;
    phone: string;
    address: string;
    abn: string;
    businessName: string;
    socialMedia: SiteMapLink[];
    seoIndex: number;
    seo: Seo;
}
