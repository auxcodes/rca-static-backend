import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SiteMap } from 'src/app/models/site-map.model';
import { SiteMapLink } from 'src/app/models/site-map-link.model';
import { CmsItemsService } from '../../services/cms/cms-items.service';
import { SiteLinksService } from '../site-links.service';

@Injectable({
    providedIn: 'root'
})
export class SiteMapService {

    content: BehaviorSubject<SiteMap> = new BehaviorSubject<SiteMap>({
        title: '',
        links: [],
        groups: [],
        seoIndex: 0,
        seo: undefined,
        artists: undefined,
        artwork: undefined,
        blogPosts: undefined
    });

    artworkLinks: BehaviorSubject<SiteMapLink[]> = new BehaviorSubject<SiteMapLink[]>([]);
    artistLinks: BehaviorSubject<SiteMapLink[]> = new BehaviorSubject<SiteMapLink[]>([]);
    blogPostLinks: BehaviorSubject<SiteMapLink[]> = new BehaviorSubject<SiteMapLink[]>([]);

    constructor(private cmsItems: CmsItemsService, private siteLinkService: SiteLinksService) { }

    getContent(): BehaviorSubject<SiteMap> {
        if (this.content.getValue().title === '') {
            try {
                this.siteMapItems();
            }
            catch (error) { console.log("Error getting about page content: ", error) };
        }
        return this.content;
    }

    async getArtworkLinks() {
        const params = {
            sort: 'sold',
            filter: {
                visible: { neq: true }
            },
            fields: 'title, id'
        };

        await this.cmsItems.getItems('artwork', params)
            .then(items => {
                const links: SiteMapLink[] = [];
                items.data.forEach(artwork => {
                    links.push({ name: artwork.title, url: 'artwork/' + artwork.id, group: 'Artwork' });
                    this.artworkLinks.next(links);
                });
            })
            .catch(error => console.log('Error getting artwork links: ', error));
    }

    async getArtistLinks() {
        const params = {
            filter: {
                visible: { neq: true }
            },
            fields: 'display_name, id'
        };

        await this.cmsItems.getItems('artist_profiles', params)
            .then(items => {
                const links: SiteMapLink[] = [];
                items.data.forEach(artist => {
                    links.push({ name: artist.display_name, url: 'artist/' + artist.id, group: 'Artists' });
                    this.artistLinks.next(links);
                });
            })
            .catch(error => console.log('Error getting artist links: ', error));
    }

    async getBlogPostLinks() {
        const params = {
            filter: {
                status: { eq: 'published' }
            },
            fields: 'title, id'
        };

        await this.cmsItems.getItems('blog_posts', params)
            .then(items => {
                const links: SiteMapLink[] = [];
                items.data.forEach(post => {
                    links.push({ name: post.title, url: 'blog/post/' + post.id, group: 'Blog Posts' });
                    this.blogPostLinks.next(links);
                });
            })
            .catch(error => console.log('Error getting blog post links: ', error));
    }
       
    private async siteMapItems() {
        await this.cmsItems.getItem('site_map', 1)
            .then(site => {
                const page: SiteMap = {
                    title: site.data.title,
                    links: site.data.links,
                    artists: site.data.display_artists,
                    artwork: site.data.display_artwork,
                    blogPosts: site.data.display_blog_posts,
                    groups: [],
                    seoIndex: site.data.seo_settings,
                    seo: undefined
                };
                this.siteLinkService.getLinkIds('site_map_site_map_link', 'site_map_link_id').then(data => {
                    this.siteLinkService.siteLinks(data).then(links => {
                        page.links = links;
                        this.content.next(page);
                        this.siteLinkService.linkGroups(page.links).then(groups => {
                            page.groups = groups;
                            this.content.next(page);
                        });
                    });
                });
                this.content.next(page);
            })
            .catch(error => console.log('Error getting sitemap contents: ', error));
    }
}
