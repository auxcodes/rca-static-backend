import { Injectable } from '@angular/core';
import { SiteMapLink } from '../models/site-map-link.model';
import { CmsItemsService } from './cms/cms-items.service';
import { ManageLink } from '../models/manage-link.model';

@Injectable({
  providedIn: 'root'
})
export class SiteLinksService {

    constructor(private cmsItems: CmsItemsService) { }

    async getLinkIds(collection: string, feild: string) {
        let ids = [];
        await this.cmsItems.getItems(collection, { fields: feild })
            .then(result => {
                ids = result;
            })
            .catch(error => console.log('Error getting site map link ids: ', error));
        return ids;
    }

    async siteLinks(ids: any[]) {
        let allLinks: SiteMapLink[] = [];
        await this.cmsItems.getItems('site_map_link', { filter: { id: { in: ids } } })
            .then(results => {
                const links: SiteMapLink[] = results.map(item => {
                    const link: SiteMapLink = {
                        id: item.id,
                        name: item.link_text,
                        url: item.url,
                        path: item.relative_path,
                        group: item.link_group
                    }
                    return link;
                })
                allLinks = links;
            })
            .catch(error => console.log('Error getting site map links: ', error));
        return allLinks;
    }

    async linkGroups(links: SiteMapLink[]) {
        const groups: string[] = [];
        links.forEach(link => {
            if (!groups.includes(link.group)) {
                groups.push(link.group);
            }
        });
        return groups;
    }

    async manageLinks(): Promise<ManageLink[]> {
        let allLinks: ManageLink[] = [];
        await this.cmsItems.getItems('admin_links', { filter: { visible: {neq: true}}, fields: 'name, text, url, relative_path, description' })
            .then(results => {
                allLinks = results.map(item => {
                    const link: ManageLink = {
                        name: item.name,
                        text: item.text,
                        url: item.url,
                        relativePath: item.relative_path,
                        description: item.description
                    }
                    return link;
                })
            })
            .catch(error => console.log('Error getting manager links: ', error));
        return allLinks;
    }
}
