import { SiteMapLink } from './site-map-link.model';

export interface Footer {
    title: string;
    text: string;
    links: SiteMapLink[];
    groups: string[];
}
