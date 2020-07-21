import { Artwork } from './artwork.model';
import { CarouselOptions } from './carousel-options.model';

export interface ArtworkCarousel {
    id: string;
    options: CarouselOptions;
    artworks: Artwork[];
}
