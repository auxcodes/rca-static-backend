import { Seo } from './seo.model';

export interface BlogPage {
    title: string;
    loadAmount?: number;
    blogPostIds?: number[];
    seoIndex?: number;
    seo?: Seo;
}
