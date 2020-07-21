import { Seo } from './seo.model';

export interface ArtistsPage {
    title: string;
    artistIds: string;
    seoIndex: number;
    seo: Seo;
}
