import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artwork } from 'src/app/models/artwork.model';
import { CmsImageService } from 'src/app/services/cms/cms-image.service';
import { CmsItemsService } from 'src/app/services/cms/cms-items.service';
import { ArtistService } from 'src/app/services/pages/artist.service';
import { GalleryPage } from '../../models/gallery-page.model';



@Injectable({
    providedIn: 'root'
})
export class GalleryService {

    artworks: BehaviorSubject<Artwork[]> = new BehaviorSubject<Artwork[]>([]);
    content: BehaviorSubject<GalleryPage> = new BehaviorSubject<GalleryPage>({
        title: '',
        endpoint: '',
        loadAmount: 10,
        artworkIds: null,
        seoIndex: 0,
        seo: undefined
    });
    sortBy: BehaviorSubject<string> = new BehaviorSubject<string>('id');
    noMore: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    private allArtwork: Artwork[] = [];
    private lastParams: object = {};
    private artistSearched = false;
    private moreCount = 0;
    private baseMoreCount = 10;
    private galleryFilter: object = {
        visible: { neq: true }
    };

    constructor(
        private cmsItems: CmsItemsService,
        private cmsImages: CmsImageService,
        private artistService: ArtistService,) {
    }

    getContent() {
        if (this.content.getValue().seo === undefined) {
            try {
                this.galleryPageItems();
            }
            catch (error) { console.log("Error getting gallery page content: ", error) };
        }
    }

    async endpoint() {
        let result = '';
        if (this.content.value.endpoint !== '') {
            result = this.content.value.endpoint;
        }
        else {
            await this.cmsItems.getItem('gallery', 1, { fields: 'products_endpoint' })
                .then(url => result = url.products_endpoint )
                .catch(error => console.log('Error getting gallery endpoint: ', error));
        }
        return result;
    }

    private async galleryPageItems() {
        await this.cmsItems.getItem('gallery', 1)
            .then(gallery => {
                const page: GalleryPage = {
                    title: gallery.title,
                    endpoint: gallery.products_endpoint,
                    artworkIds: null,
                    loadAmount: gallery.load_amount,
                    seoIndex: gallery.seo_settings,
                    seo: undefined
                };
                this.getArtworkIds().then(ids => {
                    page.artworkIds = ids;
                    this.galleryFilter = {
                        visible: { neq: true },
                        id: { in: this.content.value.artworkIds }
                    };
                    if (ids !== null) {
                        this.content.next(page);
                        this.getMoreArtwork();
                    }
                });
                this.baseMoreCount = gallery.load_amount;
                this.content.next(page);
            })
            .catch(error => console.log('Error getting gallery page items: ', error));
    }

    private async getArtworkIds() {
        let ids: number[] = [];
        await this.cmsItems.getItems('gallery_artwork', { fields: 'artwork_id' })
            .then(result => ids = result)
            .catch(error => console.log('Error getting artwork ids: ', error));
        return ids;
    }

    getArtworks() {
        try {
            if (this.artistSearched || this.allArtwork.length === 0) {
                this.moreCount = 0;
                this.artistSearched = false;
                if (this.content.value.artworkIds === null || this.content.value.artworkIds.length === 0) {
                    this.galleryPageItems();
                }
                else {
                    this.getMoreArtwork();//this.getAllArtworkItems();
                }
            }
            else {
                this.allArtwork = this.sortArtwork(this.sortBy.value, this.allArtwork);
                this.artworks.next(this.allArtwork);
            }
        }
        catch (error) { console.log("Error getting gallery artworks: ", error) };
    }

    async getMoreArtwork() {
        const moreOffset = this.moreCount * this.baseMoreCount;
        const params = {
            offset: moreOffset, limit: this.baseMoreCount,
            sort: 'sold',
            filter: this.galleryFilter
        };
        const allArtwork: Artwork[] = this.allArtwork;
        await this.artworkItems(params).then(results => {
            this.allArtwork = results; 
            if (this.allArtwork.length !== 0) {
                this.allArtwork = this.sortArtwork(this.sortBy.value,allArtwork.concat(this.allArtwork));
                this.artworks.next(this.allArtwork);
                this.moreCount++
                this.noMore.next(this.allArtwork.length < ((this.moreCount) * this.baseMoreCount));
            }
        });
    }

    sortGallery(sortBy: string) {
        this.sortBy.next(sortBy);
        this.allArtwork = this.sortArtwork(sortBy, this.allArtwork);
        this.artworks.next(this.allArtwork);
    }

    sortArtwork(sortBy: string, artwork: Artwork[]): Artwork[] {
        let result: Artwork[] = [];

        switch (sortBy) {
            case "id": {
                result = artwork.sort((a, b) => a.id - b.id);
                break;
            }
            case "-id": {
                result = artwork.sort((a, b) => b.id - a.id);
                break;
            }
            case "price": {
                result = artwork.sort((a, b) => a.price - b.price);
                break;
            }
            case "-price": {
                result = artwork.sort((a, b) => b.price - a.price);
                break;
            }
            case "sold": {
                result = artwork.sort((a, b) => +a.sold - +b.sold);
                break;
            }
            case "-sold": {
                result = artwork.sort((a, b) => +b.sold - +a.sold);
                break;
            }
            case "artist": {
                result = artwork.sort((a, b) => a.artistName > b.artistName ? 1 : -1);
                break;
            }
            case "-artist": {
                result = artwork.sort((a, b) => a.artistName < b.artistName ? 1 : -1);
                break;
            }
            default: {
                result = artwork;
                break;
            }
        }

        return result;
    }

    getArtistArtwork(artistId: number) {
        this.artistSearched = true;
        const filter = {
            sort: 'sold',
            filter: {
                artist_profile: { eq: artistId }
            }
        }

        this.moreCount = 0;
        this.noMore.next(true);

        this.artworkItems(filter).then(results => {
            this.allArtwork = results;
            this.allArtwork = this.sortArtwork(filter.sort, this.allArtwork);
            this.artworks.next(this.allArtwork);
            //console.log("GS Get Artist Artwork: ", results);
        });
    }

    async artistArtwork(artistId: number): Promise<Artwork[]> {
        const params = {
            sort: 'sold',
            filter: {
                artist_profile: { eq: artistId }
            }
        }
        let artwork: Artwork[] = [];

        await this.artworkItems(params).then(results => {
            artwork = this.sortArtwork(params.sort, results);
            //console.log("GS Artist Artwork: ", artistId, results);
        });

        return artwork;
    }

    async findById(artworkId: number): Promise<Artwork> {
        return this.allArtwork.find(art => art.id === artworkId);
    }

    markAsSold(artworkId: number) {
        this.cmsItems.updateItem('artwork', artworkId, { "sold": true })
            .catch(error => console.log('Error marking item as sold: ', error))
            .finally(() => {
                this.artworkItems(
                    {
                        offset: 0, limit: this.baseMoreCount,
                        sort: 'sold',
                        filter: this.galleryFilter
                    })
                    .then(results => {
                        this.allArtwork = results;
                        this.artworks.next(this.allArtwork);
                    })
            });
    }

    async artworkItems(param: object): Promise<Artwork[]> {
        this.lastParams = param;
        let tempArtworks: Artwork[] = [];
        await this.cmsItems.getItems('artwork', param)
            .then(artwork => {
                const artworkResult: any[] = artwork;
                tempArtworks = artworkResult.reduce((result, item) => {
                    const artCard: Artwork = {
                        id: item.id,
                        sold: item.sold,
                        title: item.title,
                        description: item.description,
                        price: item.price,
                        artistId: item.artist_profile,
                        url: this.content.getValue().endpoint,
                        type: item.type ? item.type : '-',
                        medium: item.medium ? item.medium : '-',
                        completionDate: item.completion_date ? item.completion_date : '-',
                        completionTime: item.completion_time ? item.completion_time : '-',
                        copyright: item.copyright ? item.copyright : '-',
                        dimensions: {
                            width: item.width ? item.width : 0,
                            height: item.height ? item.height : 0,
                            length: item.length ? item.length : 0
                        },
                        weight: item.weight ? item.weight : 0,
                        packaging: item.packaging ? item.packaging : '-',
                        parcelWidth: item.width ? item.width : 0,
                        parcelHeight: item.height ? item.height : 0,
                        parcelLength: item.length ? item.length : 0
                    };
                    this.artistService.artistName(artCard.artistId).then(name => artCard.artistName = name);
                    this.cmsImages.getImages(artCard.id)
                        .then(art => {
                            artCard.images = art;
                            if (artCard.images) {
                                artCard.thumbnail = artCard.images[0].thumbnailUrl;
                            }
                            else {
                                artCard.thumbnail = 'assets/icons/broken_image/image.svg';
                            }
                        })
                        .catch(error => {
                            console.log('Error getting images for artwork ', artCard.title, ': ', error)
                        });
                    result.push(artCard);
                    return result;
                }, []);
            })
            .catch(error => console.log('Error getting gallery artwork items: ', error.message));
        return tempArtworks;
    }
}
