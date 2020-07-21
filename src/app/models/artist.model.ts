import { CMSImage } from './cms-image.model';

export interface Artist {
    id: number;
    name?: string;
    biography?: string;
    thumbnail?: string;
    photoId?: number;
    photo?: CMSImage;
    artworks?: number[];
}
