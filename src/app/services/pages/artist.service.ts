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
                const page: ArtistsPage = {
                    title: artists.title,
                    artistIds: '',
                    seoIndex: artists.seo_settings,
                    seo: undefined
                };
                this.getArtworkIds().then(ids => {
                    page.artistIds = ids;
                    if (ids !== '') {
                        this.artistItems({
                            filter: {
                                visible: { neq: true }
                            }
                        });
                    }
                });
                this.content.next(page);
            })
            .catch(error => console.log('Error getting artists page items: ', error));
    }

    private async getArtworkIds() {
        let ids = '';
        await this.cmsItems.getItems('artists_page_artist_profiles', { fields: 'artist_profiles_id' })
            .then(result => {
                result.forEach(id => {
                    ids = ids.concat(id.artist_profiles_id + ', ');
                });
            })
            .catch(error => console.log('Error getting artist profile ids: ', error));
        return ids;
    }

    async artistName(artistId: number) {
        try {
            let name = "";
            await this.cmsClient.getItem('artist_profiles', artistId)
                .then(item => {
                    name = item.display_name;
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
                    id: result.id,
                    name: result.display_name,
                    biography: result.biography,
                    photoId: result.photo,
                    photo: undefined,
                    artworks: []
                };
                this.cmsImages.getImage(artistCard.photoId)
                    .then(photo => {
                        artistCard.photo = photo;
                        artistCard.thumbnail = artistCard.photo.thumbnailUrl;
                    })
            })
            .catch(error => console.log('Error getting Artist item: ', error));
        return artistCard;
    }

    async artistItems(param: object) {
        await this.cmsItems.getItems('artist_profiles', param)
            .then(results => {
                const artist: Artist[] = results.map(item => {
                    const artistCard: Artist = {
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

    sortBy: BehaviorSubject<string> = new BehaviorSubject<string>('id');

    sortArtists(sortBy: string) {
        this.sortBy.next(sortBy);
        const result = this.sortArtistsArray(sortBy, this.artists.value);
        this.artists.next(result);
    }

    private sortArtistsArray(sortBy: string, artwork: Artist[]): Artist[] {
        let result: Artist[] = [];

        switch (sortBy) {
            case "id": {
                result = artwork.sort((a, b) => a.id - b.id);
                break;
            }
            case "-id": {
                result = artwork.sort((a, b) => b.id - a.id);
                break;
            }
            case "name": {
                result = artwork.sort((a, b) => a.name > b.name ? 1 : -1);
                break;
            }
            case "-name": {
                result = artwork.sort((a, b) => a.name < b.name ? 1 : -1);
                break;
            }
            default: {
                result = artwork;
                break;
            }
        }

        return result;
    }

}
