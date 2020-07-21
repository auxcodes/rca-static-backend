import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogPage } from '../../../models/blog-page.model';
import { BlogPost } from '../../../models/blog-post.model';
import { Title } from '@angular/platform-browser';
import { SeoService } from '../../../services/seo.service';
import { CmsClientService } from '../../../services/cms/cms-client.service';
import { BlogService } from '../../../services/pages/blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FacebookSdkService } from '../../../services/utils/facebook-sdk.service';
import { Seo } from '../../../models/seo.model';
import { SortOption } from '../../../models/sort-option.model';

@Component({
    selector: 'app-all-posts',
    templateUrl: './all-posts.component.html',
    styleUrls: ['./all-posts.component.scss']
})
export class AllPostsComponent implements OnInit, OnDestroy {

    blogPage: BlogPage = {
        title: 'Blog Posts',
        loadAmount: 10,
        blogPostIds: '',
        seoIndex: 0,
        seo: undefined
    }

    posts: BlogPost[];
    loading = true;
    noPostsFound = false;
    noMore = true;

    sortOptions: SortOption[] = [
        { name: 'newest', text: 'Newest', value: '-published_on' },
        { name: 'oldest', text: 'Oldest', value: 'published_on' }];

    constructor(
        private titleService: Title,
        private seoService: SeoService,
        private cmsClient: CmsClientService,
        private blogService: BlogService,
        private router: Router,
        private route: ActivatedRoute,
        private fbSdkService: FacebookSdkService) {

    }

    ngOnInit(): void {
        this.blogService.getContent();

        this.blogService.content.subscribe(data => {
            if (data.seoIndex !== 0) {
                this.blogPage = data;
                this.titleService.setTitle(this.blogPage.title);
                this.seoService.setMetaTags(data.seoIndex)
                    .then(seo => {
                        this.setupFacebookShare(seo);
                    })
                    .catch(error => console.log('Error setting blog posts SEO meata tags: ', error));
            }
        })
        this.blogService.blogPosts.subscribe(data => {
            this.posts = data;
            this.blogService.noMore.subscribe(data => this.noMore = data);
        });
        this.blogService.hasPosts.subscribe(hasPosts => {
            if (hasPosts) {
                this.noPostsFound = this.posts.length > 0 ? false : true;
                this.loading = false;             
            }
        });
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
                    dataHref: 'https://rca.aux.codes/blog',
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes/blog',
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

    onSortPosts(event) {
        const sortBy = this.sortOptions.find(option => option.name === event.target.value);
        if (this.blogService.sortBy.value !== sortBy.value) {
            this.blogService.sortPosts(sortBy.value);
        }
    }

    onLoadMore() {
        if (!this.noMore) {
            this.blogService.getMorePosts();
        }
    }

}
