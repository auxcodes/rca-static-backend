import { Seo } from './seo.model';

export interface GalleryPage {
    title: string;
    endpoint: string;
    loadAmount: number;
    artworkIds: string;
    seoIndex: number;
    seo: Seo;
}
