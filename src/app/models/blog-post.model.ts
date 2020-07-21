export interface BlogPost {
    id?: number;
    title?: string;
    author?: string;
    description?: string;
    thumbnailId?: number;
    thumbnail?: string;
    content?: string;
    createdOn?: number;
    publishDate?: number;
    updatedOn?: number;
    keywords?: string[];
    categories?: string[];
}
