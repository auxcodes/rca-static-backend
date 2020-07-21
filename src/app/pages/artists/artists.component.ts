import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.model';
import { CmsClientService } from 'src/app/services/cms/cms-client.service';
import { ArtistService } from 'src/app/services/pages/artist.service';
import { ArtistsPage } from '../../models/artists-page.model';
import { SeoService } from '../../services/seo.service';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';
import { Seo } from '../../models/seo.model';

@Component({
    selector: 'app-artists',
    templateUrl: './artists.component.html',
    styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit, OnDestroy {
    artistsPage: ArtistsPage = {
        title: 'Artists',
        artistIds: '',
        seoIndex: 0,
        seo: undefined
    };

    artists: Artist[];

    focusArtist = false;
    artistInFocus: Artist;
    artistOnly = false;


    constructor(
        private titleService: Title,
        private seoService: SeoService,
        private cmsClient: CmsClientService,
        private artistService: ArtistService,
        private router: Router,
        private route: ActivatedRoute,
        private fbSdkService: FacebookSdkService) {
    }

    ngOnInit() {
        this.artistService.getArtists();
        this.artistService.artists.subscribe((data) => {
            this.artists = data;
            const param: any = this.route.snapshot.paramMap.get('name');
            if (param !== null) {
                const id: number = +param;
                if (!isNaN(id)) {
                    this.artistOnly = true;
                    this.artistIdCheck(id);
                }
            }
        });
        this.artistService.content.subscribe((data) => {
            if (data.seoIndex !== 0) {
                this.artistsPage = data;
                this.titleService.setTitle(this.artistsPage.title);
                this.seoService.setMetaTags(data.seoIndex)
                    .then(seo => {
                        this.setupFacebookShare(seo);
                    })
                    .catch(error => console.log('Error setting artists page SEO meata tags: ', error));
            }
        })
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
                    dataHref: 'https://rca.aux.codes/artists',
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes/artists',
                    ogType: 'website',
                    ogTitle: seo.title,
                    ogDescription: seo.description,
                    ogImage: 'https://api.risecommunityart.com.au/uploads/_/originals/logo-medium-784w.png',
                    ogImageAlt: 'RISE Community Art Logo',
                });
            }
        });
    }

    ngOnDestroy() {
        this.fbSdkService.resetShareButton();
    }

    private artistIdCheck(artistId: number) {
        if (this.artists.length > 0) {
            this.onOpenArtist(artistId)
        }
        else {
            this.artistService.artistById(artistId)
                .then(artist => {
                    this.artistInFocus = artist;
                    this.focusArtist = this.artistInFocus !== undefined;
                })
                .catch(error => console.log('Error getting artist', error));
        }
    }

    onOpenArtist(artistId: number) {
        this.artistInFocus = this.artists.find(artist => artist.id === artistId);
        this.focusArtist = this.artistInFocus !== undefined;
    }

    onViewArtwork(artistId: number) {
        this.router.navigate(['/gallery/artist/' + artistId]);
    }

    onCloseArtist(open: boolean) {
        this.focusArtist = open;
        this.artistInFocus = undefined;
    }
}
