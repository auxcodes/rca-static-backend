import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Artwork } from 'src/app/models/artwork.model';
import { ArtworkService } from '../../services/pages/artwork.service';
import { GalleryService } from '../../services/pages/gallery.service';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-artwork',
  templateUrl: './artwork.component.html',
  styleUrls: ['./artwork.component.scss']
})
export class ArtworkComponent implements OnInit {

    artwork: Artwork = { id: 0 };
    imageIndex = 0;
    private maxImageSize = 900;

    constructor(
        private galleryService: GalleryService,
        private artworkService: ArtworkService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router,
        private titleService: Title,
        private fbSdkService: FacebookSdkService) {
 
    }

    ngOnInit() {
        const id: number = +this.route.snapshot.paramMap.get('id');
        if (this.galleryService.artworks.value.length >= this.galleryService.content.value.loadAmount) {
            this.checkGalleryStorage(id);
        }
        else {
            this.getArtDirectly(id);
        }
    }

    private setTitle() {
        this.titleService.setTitle(this.artwork.title + ": " + this.artwork.artistName );
    }

    private checkGalleryStorage(id: number) {
        this.galleryService.findById(id)
            .then(result => {
                if (result !== undefined) {
                    this.artwork = result;
                    this.setTitle();
                    this.setupFacebookShare();
                }
                else {
                    this.getArtDirectly(id);
                }
            })
            .catch(error => console.log('Error getting artwork from gallery service: ', error));
    }

    private getArtDirectly(id: number) {
        this.artworkService.getArtworkById(id, this.maxImageSize)
            .then(result => {
                this.artwork = result;
                this.setTitle();
                this.setupFacebookShare();
            })
            .catch(error => console.log('Error getting artwork from artwork service: ', error));
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
                    dataHref: 'https://rca.aux.codes/artwork/' + this.artwork.id,
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes/artwork/' + this.artwork.id,
                    ogType: 'website',
                    ogTitle: this.artwork.title,
                    ogDescription: this.artwork.description,
                    ogImage: this.artwork.images ? this.artwork.images[0].url : 'assets/static-content/images/logo-medium-784w.png',
                    ogImageAlt: this.artwork.images ? this.artwork.images[0].altText : 'RISE Community Art Logo',
                });
            }
        });
    }

    onBack() {
        this.location.back();
    }

    viewArtist() {
        this.router.navigate(['/artist/' + this.artwork.artistId]);
    }

    onNextImage() {
        if ((this.imageIndex + 1) === this.artwork.images.length) {
            this.imageIndex = 0;
        }
        else {
            this.imageIndex += 1;
        }
    }

    onZoomImage(imageId: number) {
        this.imageIndex = this.artwork.images.findIndex(art => art.id === imageId);
    }

}
