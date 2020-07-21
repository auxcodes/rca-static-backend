import { Seo } from './seo.model';

export interface BlogPage {
    title: string;
    loadAmount?: number;
    blogPostIds?: string;
    seoIndex?: number;
    seo?: Seo;
}
