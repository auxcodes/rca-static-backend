import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CmsClientService } from 'src/app/services/cms/cms-client.service';
import { CmsImageService } from 'src/app/services/cms/cms-image.service';
import { CmsItemsService } from 'src/app/services/cms/cms-items.service';
import { BlogPost } from '../../models/blog-post.model';
import { BlogPage } from '../../models/blog-page.model';

@Injectable({
    providedIn: 'root'
})
export class BlogService {

    blogPosts: BehaviorSubject<BlogPost[]> = new BehaviorSubject<BlogPost[]>([]);
    hasPosts: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    content: BehaviorSubject<BlogPage> = new BehaviorSubject<BlogPage>({
        title: '',
        blogPostIds: null,
        seoIndex: 0,
        seo: undefined
    });
    sortBy: BehaviorSubject<string> = new BehaviorSubject<string>('-published_on');
    noMore: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    private cachedBlogPosts: BlogPost[] = [];
    private moreCount = 0;
    private baseMoreCount = 10;
    private postsFilter: object = {
        status: { eq: 'published' }
    };
    private imageSize = 500;
    private imageQuality = 'okay';

    constructor(private cmsItems: CmsItemsService,
        private cmsClient: CmsClientService,
        private cmsImages: CmsImageService) { }

    getContent() {
        try {
            if (this.cachedBlogPosts.length === 0) {
                this.moreCount = 0;
                if (this.content.value.blogPostIds === null) {
                    this.blogPageItems();
                }
                else {
                    this.getBlogPosts();
                }
            }
            else {
                this.blogPosts.next(this.cachedBlogPosts);
            }
        }
        catch (error) { console.log("Error getting blog page content: ", error) };
    }

    private async blogPageItems() {
        await this.cmsItems.getItem('blog_page', 1)
            .then(result => {
                const page: BlogPage = {
                    title: result.title,
                    loadAmount: result.load_amount,
                    blogPostIds: null,
                    seoIndex: result.seo_settings,
                    seo: undefined
                };
                this.getBlogPostIds().then(ids => {
                    page.blogPostIds = ids;
                    this.postsFilter = {
                        status: { eq: 'published' },
                        id: { in: this.content.value.blogPostIds }
                    }
                    if (ids !== null) {
                        this.content.next(page);
                        this.getBlogPosts();
                    }
                });
                this.baseMoreCount = page.loadAmount;
                this.content.next(page);
            })
            .catch(error => console.log('Error getting blog page items: ', error));
    }

    private async getBlogPostIds() {
        let ids: number[] = [];
        await this.cmsItems.getItems('blog_page_blog_posts', { fields: 'blog_posts_id' })
            .then(result => ids = result)
            .catch(error => console.log('Error getting blog post ids: ', error));
        return ids;
    }

    private getBlogPosts() {
        const params = {
            offset: 0, limit: this.baseMoreCount,
            sort: this.sortBy.value,
            filter: this.postsFilter
        };
        this.blogPostItems(params).then(results => {
            this.cachedBlogPosts = results;
            this.blogPosts.next(this.cachedBlogPosts);
            this.moreCount++;
            this.noMore.next(this.cachedBlogPosts.length < ((this.moreCount) * this.baseMoreCount));
        });
    }

    sortPosts(sortBy: string) {
        this.sortBy.next(sortBy);

        if (this.cachedBlogPosts.length > 0) {
            const sorted = this.cachedBlogPosts.reverse();
            this.cachedBlogPosts = sorted;
            this.blogPosts.next(this.cachedBlogPosts);
        }
    }

    async blogPostItems(param: object): Promise<BlogPost[]> {

        let postResults: BlogPost[] = [];
        await this.cmsItems.getItems('blog_posts', param)
            .then(results => {
                postResults = results.map(item => {
                    let post: BlogPost;
                    post = {
                        id: item.id,
                        title: item.title,
                        author: item.author,
                        content: item.content,
                        description: item.description,
                        thumbnailId: item.thumbnail_image,
                        thumbnail: 'assets/icons/broken_image/image.svg',
                        createdOn: item.created_on,
                        publishDate: item.published_on ? item.published_on : item.created_on,
                        updatedOn: item.published_on,
                        keywords: item.tags ? item.tags : ['']
                    };
                    post.updatedOn = item.updated_on ? item.updated_on : post.publishDate;
                    this.cmsImages.getImage(post.thumbnailId)
                        .then(image => {
                            post.thumbnail = this.cmsImages.resizeImageUrl(image.filename, this.imageSize, this.imageQuality);
                        })

                    return post;
                })
                this.blogPosts.next(postResults);
                this.hasPosts.next(true);
            })
            .catch(error => {
                console.log('Error getting blog post items: ', error);
                this.hasPosts.next(true);
            });
        return postResults;
    }

    async blogPostById(blogPostId: number): Promise<BlogPost> {
        let blogPost: BlogPost;
        if (this.blogPosts.value.length > 0) {
            blogPost = this.blogPosts.value.find(post => post.id === blogPostId);
        }
        else {
            await this.blogPostItem(blogPostId)
                .then(result => blogPost = result)
                .catch(error => console.log('Error getting blog post: ', error));
        }
        return blogPost;
    }

    async blogPostItem(postId: number): Promise<BlogPost> {
        let blogPost: BlogPost;
        await this.cmsItems.getItem('blog_posts', postId)
            .then(result => {
                blogPost = {
                    id: result.id,
                    title: result.title,
                    author: result.author,
                    content: result.content,
                    description: result.description,
                    thumbnailId: result.thumbnail_image,
                    thumbnail: 'assets/icons/broken_image/image.svg',
                    createdOn: result.created_on,
                    publishDate: result.published_on ? result.published_on : result.created_on,
                    updatedOn: result.published_on,
                    keywords: result.tags ? result.tags : ['']
                };
                blogPost.updatedOn = result.updated_on ? result.updated_on : blogPost.publishDate;
                this.cmsImages.getImage(blogPost.thumbnailId)
                    .then(image => {
                        blogPost.thumbnail = this.cmsImages.resizeImageUrl(image.filename, this.imageSize, this.imageQuality);
                    })
                    .catch(error => console.log('Error getting blog post thumbnail: ', error));
            })
            .catch(error => console.log('Error getting blog post item: ', error));
        return blogPost;
    }

    async getMorePosts() {
        const moreOffset = this.moreCount * this.baseMoreCount;
        const params = {
            offset: moreOffset, limit: this.baseMoreCount,
            sort: this.sortBy.value,
            filter: this.postsFilter
        };
        const currentPosts: BlogPost[] = this.cachedBlogPosts;
        await this.blogPostItems(params).then(results => {
            this.cachedBlogPosts = results;
            if (this.cachedBlogPosts.length !== 0) {
                this.cachedBlogPosts = currentPosts.concat(this.cachedBlogPosts);
                this.blogPosts.next(this.cachedBlogPosts);
                this.moreCount++
                this.noMore.next(this.cachedBlogPosts.length < ((this.moreCount) * this.baseMoreCount));
            }
        });
    }

}
