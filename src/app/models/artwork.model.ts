import { CMSImage } from './cms-image.model';
import { Dimensions } from './dimensions.model';

export interface Artwork {
    id: number;
    sold?: boolean;
    title?: string;
    description?: string;
    price?: number;
    artistId?: number;
    artistName?: string;
    imagesIndex?: number;
    thumbnail?: string;
    images?: CMSImage[];
    url?: string;
    type?: string;
    medium?: string;
    completionDate?: string;
    completionTime?: string;
    copyright?: string;
    dimensions?: Dimensions;
    weight?: number;
    packaging?: string;
    parcelWidth?: number;
    parcelHeight?: number;
    parcelLength?: number;
}
