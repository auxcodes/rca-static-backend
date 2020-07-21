import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SiteMapService } from '../../services/pages/site-map.service';
import { SiteMap } from '../../models/site-map.model';
import { SeoService } from '../../services/seo.service';


@Component({
    selector: 'app-sitemap',
    templateUrl: './sitemap.component.html',
    styleUrls: ['./sitemap.component.scss']
})
export class SitemapComponent implements OnInit {

    content: SiteMap = {
        title: 'Site Map',
        links: [],
        groups: [],
        artists: undefined,
        artwork: undefined,
        blogPosts: undefined,
        seoIndex: 0,
        seo: undefined
    };

    linkGroups = [];

    constructor(
        private titleService: Title,
        private siteMapService: SiteMapService,
        private seoService: SeoService) {
    }

    ngOnInit() {
        this.siteMapService.getContent().subscribe(data => {
            if (data.title !== '') {
                this.content = data;
                this.titleService.setTitle(this.content.title);
                this.seoService.setMetaTags(this.content.seoIndex);
                if (data.groups && data.groups.length > 0) {
                    data.groups.forEach(group => {
                        this.linkGroups.push({ name: group, text: group, links: [] });
                    });
                    data.links.forEach(link => {
                        this.linkGroups.find(({ name }) => name === link.group).links.push(link);
                    });
                    if (data.artwork) this.addArtwork();
                    if (data.artists) this.addArtists();
                    if (data.blogPosts) this.addBlogPosts();

                }

            }
        });
    }

    private addArtwork() {
        this.siteMapService.getArtworkLinks().then(() => {
            this.linkGroups.push({ name: 'artwork', text: 'Artwork', links: [] });
            this.siteMapService.artworkLinks.subscribe(links => {
                if (links) {
                    this.linkGroups.find(({ name }) => name === 'artwork').links = links;
                }
            });
        });
    }

    private addArtists() {
        this.siteMapService.getArtistLinks().then(() => {
            this.linkGroups.push({ name: 'artists', text: 'Artists', links: [] });
            this.siteMapService.artistLinks.subscribe(links => {
                if (links) {
                    this.linkGroups.find(({ name }) => name === 'artists').links = links;
                }
            });
        });
    }

    private addBlogPosts() {
        this.siteMapService.getBlogPostLinks().then(() => {
            this.linkGroups.push({ name: 'blogPosts', text: 'Blog Posts', links: [] });
            this.siteMapService.blogPostLinks.subscribe(links => {
                if (links) {
                    this.linkGroups.find(({ name }) => name === 'blogPosts').links = links;
                }
            });
        });
    }
}
