import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artwork } from 'src/app/models/artwork.model';
import { CmsImageService } from 'src/app/services/cms/cms-image.service';
import { CmsItemsService } from 'src/app/services/cms/cms-items.service';
import { environment } from '../../../environments/environment';
import { ArtistService } from './artist.service';
import { GalleryService } from './gallery.service';


@Injectable({
    providedIn: 'root'
})
export class ArtworkService {

    artwork: BehaviorSubject<Artwork> = new BehaviorSubject<Artwork>({ id: 0 });

    constructor(
        private cmsItems: CmsItemsService,
        private cmsImages: CmsImageService,
        private artistService: ArtistService,
        private galleryService: GalleryService) { }

    async getArtworkById(artworkId: number, size: number): Promise<Artwork> {
        let result: Artwork;
        if (this.artwork.getValue().id !== artworkId) {
            await this.artworkbyId(artworkId, size)
                .then(art => {
                    this.artwork.next(art);
                    result = art;
                })
                .catch(error => console.log("Error getting artwork by Id: ", error));
        }
        else {
            result = this.artwork.getValue();
        }
        return result;
    }

    resizeImageUrl(imageFileName: string, size: number, quality: string) {
        return environment.rootDir + '/thumbnail/_/' + size + '/' + size + '/contain/' + quality + '/' + imageFileName;
    }

    private async artworkbyId(artworkId: number, size: number): Promise<Artwork> {
        let artCard: Artwork = { id: 0 };
        await this.cmsItems.getItem('artwork', artworkId)
            .then(artwork => {
                if (artwork.visible) {
                    artCard = {
                        id: artwork.id,
                        sold: artwork.sold,
                        title: artwork.title,
                        description: artwork.description,
                        price: artwork.price,
                        artistId: artwork.artist_profile,
                        url: '',
                        type: artwork.type ? artwork.type : '-',
                        medium: artwork.medium ? artwork.medium : '-',
                        completionDate: artwork.completion_date ? artwork.completion_date : '-',
                        completionTime: artwork.completion_time ? artwork.completion_time : '-',
                        copyright: artwork.copyright ? artwork.copyright : '-',
                        dimensions: {
                            width: artwork.width ? artwork.width : 0,
                            height: artwork.height ? artwork.height : 0,
                            length: artwork.length ? artwork.length : 0
                        },
                        weight: artwork.weight ? artwork.weight : 0,
                        packaging: artwork.packaging ? artwork.packaging : '-',
                        parcelWidth: artwork.width ? artwork.width : 0,
                        parcelHeight: artwork.height ? artwork.height : 0,
                        parcelLength: artwork.length ? artwork.length : 0
                    };
                    this.artistService.artistName(artCard.artistId).then(name => artCard.artistName = name);
                    this.galleryService.endpoint().then(endpoint => {
                        artCard.url = endpoint;
                    });
                    this.cmsImages.getImages(artCard.id)
                        .then(art => {
                            artCard.images = art;
                            if (artCard.images) {
                                artCard.thumbnail = artCard.images[0].thumbnailUrl;
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
