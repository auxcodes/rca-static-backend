import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Artist } from 'src/app/models/artist.model';
import { CmsClientService } from 'src/app/services/cms/cms-client.service';
import { CmsImageService } from 'src/app/services/cms/cms-image.service';
import { CmsItemsService } from 'src/app/services/cms/cms-items.service';
import { ArtistsPage } from '../../models/artists-page.model';

@Injectable({
    providedIn: 'root'
})
export class ArtistService {

    artists: BehaviorSubject<Artist[]> = new BehaviorSubject<Artist[]>([]);
    content: BehaviorSubject<ArtistsPage> = new BehaviorSubject<ArtistsPage>({
        title: '',
        artistIds: '',
        seoIndex: 0,
        seo: undefined
    });

    constructor(
        private cmsItems: CmsItemsService,
        private cmsClient: CmsClientService,
        private cmsImages: CmsImageService, ) { }

    getContent() {
        if (this.content.getValue().seo === undefined) {
            try {
                this.artistsPageItems();
            }
            catch (error) { console.log("Error getting artists page content: ", error) };
        }
    }

    getArtists() {
        if (this.artists.value.length === 0) {
            try {
                if (this.content.value.seoIndex === 0) {
                    this.artistsPageItems();
                }
            }
            catch (error) { console.log("Error getting artist content: ", error) };
        }
    }

    private async artistsPageItems() {
        await this.cmsItems.getItem('artists_page', 1)
            .then((artists) => {
                let page: ArtistsPage = {
                    title: artists.data.title,
                    artistIds: '',
                    seoIndex: artists.data.seo_settings,
                    seo: undefined
                };
                this.getArtworkIds().then(ids => {
                    page.artistIds = ids;
                    if (ids !== '') {
                        this.artistItems({
                            filter: {
                                visible: { neq: true },
                                id: { in: this.content.value.artistIds }
                            }
                        });
                    }
                });
                this.content.next(page);
            })
            .catch(error => console.log('Error getting artists page items: ', error));
    }

    private async getArtworkIds() {
        let ids: string = '';
        await this.cmsItems.getItems('artists_page_artist_profiles', { fields: 'artist_profiles_id' })
            .then(result => {
                result.data.forEach(id => {
                    ids = ids.concat(id.artist_profiles_id + ', ');
                });
            })
            .catch(error => console.log('Error getting artist profile ids: ', error));
        return ids;
    }

    async artistName(artistId: number) {
        try {
            let name: string = "";
            await this.cmsClient.client.getItem('artist_profiles', artistId)
                .then(item => {
                    name = item.data.display_name;
                })
                .catch(e => console.log('Could not get name: ', e));
            return name;
        }
        catch (error) {
            console.log('Error getting artists name: ', error);
            return;
        }
    }

    async artistById(artistId: number): Promise<Artist> {
        let artist: Artist;
        if (this.artists.getValue().length > 0) {
            artist = this.artists.getValue().find(artist => artist.id === artistId);
        }
        else {
            await this.artistItem(artistId).then(result => artist = result);
        }
        return artist;
    }

    async artistItem(artistsId: number): Promise<Artist> {
        let artistCard: Artist = { id: 0 };
        await this.cmsItems.getItem('artist_profiles', artistsId)
            .then(result => {
                artistCard = {
                    id: result.data.id,
                    name: result.data.display_name,
                    biography: result.data.biography,
                    photoId: result.data.photo,
                    photo: undefined,
                    artworks: []
                };
                this.cmsImages.getImage(artistCard.photoId)
                    .then(photo => {
                        artistCard.photo = photo;
                        artistCard.thumbnail = artistCard.photo.thumbnailUrl;
                    })
            })
            .catch(error => console.log('Error getting Artist items: ', error));
        return artistCard;
    }

    async artistItems(param: object) {
        await this.cmsItems.getItems('artist_profiles', param)
            .then(results => {
                let artist: Artist[] = results.data.map(item => {
                    let artistCard: Artist = {
                        id: item.id,
                        name: item.display_name,
                        biography: item.biography,
                        photoId: item.photo,
                        photo: undefined,
                        artworks: []
                    };
                    this.cmsImages.getImage(artistCard.photoId)
                        .then(photo => {
                            artistCard.photo = photo;
                            artistCard.thumbnail = artistCard.photo.thumbnailUrl;
                        })

                    return artistCard;
                })
                this.artists.next(artist);
            })
            .catch(error => console.log('Error getting Artist items: ', error));
    }

}
