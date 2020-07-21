import { Seo } from './seo.model';

export interface TermsPage {
    title: string;
    content: string;
    seoIndex: number;
    seo: Seo;
}
