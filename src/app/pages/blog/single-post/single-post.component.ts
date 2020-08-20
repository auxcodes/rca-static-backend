import { Component, OnInit, OnDestroy, ElementRef, ViewChild} from '@angular/core';
import { BlogPost } from '../../../models/blog-post.model';
import { FacebookSdkService } from '../../../services/utils/facebook-sdk.service';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../services/pages/blog.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { SeoService } from '../../../services/seo.service';

@Component({
    selector: 'app-single-post',
    templateUrl: './single-post.component.html',
    styleUrls: ['./single-post.component.scss']
})
export class SinglePostComponent implements OnInit, OnDestroy {

    postData: BlogPost = {
        id: 1,
        title: 'Loading...',      
        thumbnail: 'assets/icons/broken_image/image.svg',
        author: 'Loading...',
        publishDate: (new Date()).getDate(),
        updatedOn: (new Date()).getDate(),
        content: 'Loading...',
        description: '',

    };

    @ViewChild('postImage') private headerImage: ElementRef;
    private isExpanded = false;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private blogService: BlogService,
        private titleService: Title,
        private seoService: SeoService,
        private fbSdkService: FacebookSdkService) { }

    ngOnInit(): void {
        const id: number = +this.route.snapshot.paramMap.get('id');
        this.blogService.blogPostById(id)
            .then(result => {
                this.postData = result;
                this.titleService.setTitle(this.postData.title);
                this.seoService.setMetaTagsWithSeo({ id: 0, keywords: result?.keywords.join(', '), description: result.description })
                    .then(() => {
                        this.setupFacebookShare();
                    })
                    .catch(error => console.log('Error setting blog posts SEO meata tags: ', error));
            })
            .catch(error => console.log('Error getting blog post: ', error));
    }

    ngOnDestroy() {
        this.fbSdkService.resetShareButton();
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
                    dataHref: 'https://rca.aux.codes/blog/post/' + this.postData.id,
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes/blog/post/' + this.postData.id,
                    ogType: 'website',
                    ogTitle: this.postData.title,
                    ogDescription: this.postData.description,
                    ogImage: this.postData.thumbnail ? this.postData.thumbnail : 'assets/static-content/images/logo-medium-784w.png',
                    ogImageAlt: this.postData.thumbnail ? 'Title image for blog post ' + this.postData.thumbnail : 'RISE Community Art Logo',
                });
            }
        });
    }

    onBack() {
        this.location.back();
    }

    onToggleExpand() {
        if (this.isExpanded) {
            this.headerImage.nativeElement.className = 'post-image-collapsed';
            this.isExpanded = false;
        }
        else {
            this.headerImage.nativeElement.className = 'post-image-expanded';
            this.isExpanded = true;
        }
    }

    onKeyPress(event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            this.onToggleExpand();
        }
    }
}
