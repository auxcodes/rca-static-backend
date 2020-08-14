import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Artwork } from 'src/app/models/artwork.model';
import { CmsClientService } from 'src/app/services/cms/cms-client.service';
import { GalleryService } from 'src/app/services/pages/gallery.service';
import { GalleryPage } from '../../models/gallery-page.model';
import { SeoService } from '../../services/seo.service';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';
import { Seo } from '../../models/seo.model';
import { SortOption } from '../../models/sort-option.model';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, OnDestroy {

    galleryPage: GalleryPage = {
        title: 'Gallery',
        endpoint: '',
        loadAmount: 10,
        artworkIds: null,
        seoIndex: 0,
        seo: undefined
    };

    artworks: Artwork[];

    focusArtwork = false;
    artInFocus: Artwork;
    noMore = true;

    sortOptions: SortOption[] = [
        { name: 'newest', text: 'Newest', value: '-id' },
        { name: 'oldest', text: 'Oldest', value: 'id' },
        { name: 'price', text: 'Price+', value: 'price' },
        { name: '-price', text: 'Price-', value: '-price' },
        { name: 'artist', text: 'Artist+', value: 'artist' },
        { name: '-artist', text: 'Artist-', value: '-artist' },
        { name: 'sold', text: 'Sold+', value: 'sold' },
        { name: '-sold', text: 'Sold-', value: '-sold' }];

    constructor(
        private cmsClient: CmsClientService,
        private galleryService: GalleryService,
        private titleService: Title,
        private seoService: SeoService,
        private route: ActivatedRoute,
        private router: Router,
        private fbSdkService: FacebookSdkService) {
    }

    ngOnInit() {
        this.checkRoute();
        // get page specific content
        this.galleryService.content.subscribe(data => {
            if (data.endpoint !== '') {
                this.galleryPage = data;
                this.titleService.setTitle(this.galleryPage.title);
                this.seoService.setMetaTags(data.seoIndex).then(seo => {
                    this.setupFacebookShare(seo);
                });
            }
        })
        // get artworks
        this.galleryService.artworks.subscribe(data => {
            this.artworks = data;
            this.galleryService.noMore.subscribe(data => this.noMore = data);
        });
    }

    private checkRoute() {
        const path: string = this.route.snapshot.routeConfig.path;
        if (path === 'gallery' || path === '__') {
            this.galleryService.getArtworks();
        }
        if (path === 'artist/:id') {
            this.galleryService.getArtistArtwork(this.route.snapshot.params['id'] * 1);
        }
    }

    private setupFacebookShare(seo: Seo) {
        this.fbSdkService.sdkSettings.subscribe(sdkData => {
            if (sdkData.appId !== '') {
                this.fbSdkService.setShareButton({
                    dataShare: true,
                    dataWidth: '',
                    dataShowFaces: true,
                    dataLayout: 'button_count',
                    dataSize: 'small',
                    dataHref: 'https://rca.aux.codes/gallery',
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes/gallery',
                    ogType: 'website',
                    ogTitle: seo.title,
                    ogDescription: seo.description,
                    ogImage: 'assets/static-content/images/logo-medium-784w.png',
                    ogImageAlt: 'RISE Community Art Logo',
                });
            }
        });
    }

    ngOnDestroy() {
        this.fbSdkService.resetShareButton();
    }

    onLoadMore() {
        if (!this.noMore) {
            this.galleryService.getMoreArtwork();
        }
    }

    onOpenArtwork(artworkId: number) {
        this.router.navigate(['/artwork/' + artworkId]);
    }

    onCloseArtwork(open: boolean) {
        this.focusArtwork = open;
        this.artInFocus = undefined;
    }

    anchorLink(achorId: string) {
        location.hash = achorId;
    }

    sortGallery(selected: number) {
        //console.log("GC sortGallery()", selected);
        this.galleryService.sortGallery(this.sortOptions[selected].value);
    }
}
