import { Injectable } from '@angular/core';
import { CmsItemsService } from './cms/cms-items.service';
import { CmsImageService } from './cms/cms-image.service';
import { ArtistService } from './pages/artist.service';
import { Artwork } from '../models/artwork.model';
import { ArtworkCarousel } from '../models/artwork-carousel.model';
import { ArtworkService } from './pages/artwork.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ArtworkCarouselService {

    private imageSize = 500;
    private imageQuality = 'okay';

    constructor(private cmsItems: CmsItemsService,
        private cmsImages: CmsImageService,
        private artworkService: ArtworkService,
        private artistService: ArtistService) { }

    async carouselId(carouselCollection: string): Promise<number[]> {
        let result: number[] = [];
        await this.cmsItems.getItems(carouselCollection, { fields: 'image_carousel_id' })
            .then(ids => {
                result = ids.data.map(item => {
                    return item.image_carousel_id;
                })
            })
        return result;
    }

    async getCarousel(id: number): Promise<BehaviorSubject<ArtworkCarousel>> {
        const result: BehaviorSubject <ArtworkCarousel> = new BehaviorSubject<ArtworkCarousel>(undefined)
        this.carouselItem(id).then(item => {
            if (item) {
                result.next(item);
            }
        });
        return result;
    }

    private async carouselItem(id: number): Promise<ArtworkCarousel> {
        let result: ArtworkCarousel;
        await this.cmsItems.getItem('image_carousel', id)
            .then(item => {
                const carousel: ArtworkCarousel = {
                    id : item.data.id,
                    options: {
                        autoScroll: item.data.auto_scroll,
                        autoScrollTime: item.data.auto_scroll_time,
                        imageSpacing: item.data.image_spacing,
                        scrollSpeed: item.data.scroll_speed + 'ms ease-in-out',
                        showControls: item.data.show_controls
                    },
                    artworks: []
                }
                result = carousel;
                this.artworkIds('image_carousel_artwork', result.id)
                    .then(ids => {
                        this.carouselArt(ids).then(artwork => result.artworks = artwork);
                    });
            })
        return result;
    }

    private async artworkIds(collection: string, carouselId: string): Promise<number[]> {
        let result: number[] = [];
        await this.cmsItems.getItems(collection, { filter: { image_carousel_id: { eq: carouselId } }, fields: 'artwork_id' })
            .then(ids => {
                result = ids.data.map(item => {
                    return item.artwork_id;
                })
            })
        return result;
    }

    private async carouselArt(artworkIds: number[]): Promise<Artwork[]> {
        const results: Artwork[] = [];
        try {
            artworkIds.map(item => {
                this.artworkById(item).then(art => {
                    results.push(art);
                });
            });
        }
        catch (error) { console.log("Error getting carousel art: ", error) };
        return results;
    }

    private async artworkById(artworkId: number): Promise<Artwork> {
        let artCard: Artwork = { id: 0 };
        await this.cmsItems.getItem('artwork', artworkId)
            .then(artwork => {
                if (artwork.data.visible) {
                    artCard = {
                        id: artwork.data.id,
                        title: artwork.data.title,
                        artistId: artwork.data.artist_profile,
                        url: '/artwork/' + artwork.data.id
                    };
                    this.artistService.artistName(artCard.artistId).then(name => artCard.artistName = name);
                    this.cmsImages.getImages(artCard.id)
                        .then(art => {
                            artCard.images = art;
                            if (artCard.images) {
                                artCard.thumbnail = this.artworkService.resizeImageUrl(artCard.images[0].filename, this.imageSize, this.imageQuality);
                            }
                            else {
                                artCard.thumbnail = 'assets/icons/broken_image/image.svg';
                            }
                        });
                }
            })
            .catch(error => {
                console.log('Error getting artwork contents: ', error.msg);
            });
        return artCard;
    }
}
