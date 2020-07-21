import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Artist } from 'src/app/models/artist.model';
import { Artwork } from '../../models/artwork.model';
import { ArtistService } from '../../services/pages/artist.service';
import { GalleryService } from '../../services/pages/gallery.service';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';

@Component({
    selector: 'app-artist-page',
    templateUrl: './artist-page.component.html',
    styleUrls: ['./artist-page.component.scss']
})
export class ArtistPageComponent implements OnInit, OnDestroy {

    artist: Artist;
    artworks: Artwork[];
    artistsLink = '/artists/__';

    constructor(
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute,
        private location: Location,
        private artistService: ArtistService,
        private galleryService: GalleryService,
        private fbSdkService: FacebookSdkService) {

    }

    ngOnInit() {
        const id: number = +this.route.snapshot.paramMap.get('id');
        this.artistService.artistById(id)
            .then(artist => {
                this.artist = artist;
                this.setupFacebookShare();
            })
            .catch(error => console.log('Error getting artist from artist service: ', error));
        // get artworks
        this.galleryService.artistArtwork(id.toString())
            .then(result => this.artworks = result)
            .catch(error => console.log('Error getting Artwork for Artist: ', this.artist.name, 'error: ', error));
    }

    private setupFacebookShare() {
        this.fbSdkService.sdkSettings.subscribe(sdkData => {
            if (sdkData.appId !== '') {
                this.fbSdkService.setShareButton({
                    dataShare: true,
                    dataWidth: '',
                    dataShowFaces: true,
                    dataLayout: 'button_count',
                    dataSize: 'small',
                    dataHref: 'https://rca.aux.codes/artist/' + this.artist.id,
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes/artist/' + this.artist.id,
                    ogType: 'website',
                    ogTitle: this.artist.name,
                    ogDescription: this.artist.name,
                    ogImage: this.artist.photo ? this.artist.photo.url : 'https://api.risecommunityart.com.au/uploads/_/originals/logo-medium-784w.png',
                    ogImageAlt: this.artist.photo ? this.artist.photo.altText : 'RISE Community Art Logo',
                });
            }
        });
    }

    ngOnDestroy() {
        this.fbSdkService.resetShareButton();
    }

    onBack() {
        this.location.back();
    }

    artistBiography() {
        return this.sanitizer.bypassSecurityTrustHtml(this.artist.biography);
    }

    viewArtistsArtwork() {
        this.galleryService.getArtistArtwork(this.artist.id.toString());
    }

    backgroundImage() {
        const srcUrl: string = 'url(' + this.artist.photo.url + ')';
        return this.sanitizer.bypassSecurityTrustStyle(srcUrl);
    }

}
