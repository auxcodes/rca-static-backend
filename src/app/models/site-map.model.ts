import { Seo } from './seo.model';
import { SiteMapLink } from './site-map-link.model';

export interface SiteMap {
    title: string;
    links: SiteMapLink[];
    groups: string[];
    artwork: boolean;
    artists: boolean;
    blogPosts: boolean;
    seoIndex: number;
    seo: Seo;
}
