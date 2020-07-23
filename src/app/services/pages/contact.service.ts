import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Contact } from '../../models/contact.model';
import { CmsItemsService } from '../../services/cms/cms-items.service';
import { SiteMapLink } from '../../models/site-map-link.model';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

    content: BehaviorSubject<Contact> = new BehaviorSubject<Contact>({
        title: '',
        contactText: '',
        email: '',
        phone: '',
        address: '',
        abn: '',
        businessName: '',
        socialMedia: [],
        seoIndex: 0,
        seo: undefined
    });

    constructor(
        private cmsItems: CmsItemsService) {
        this.getContent();
    }

    getContent() {
        if (this.content.getValue().address === '') {
            try {
                this.contactPageItems();
            }
            catch (error) { console.log("Error getting contact information: ", error.msg) };
        }
    }

    async sendMessage(name: string, email: string, message: string) {
        await this.cmsItems.createItem('feedback_messages', { name: name, email: email, message: message })
            .catch(error => console.log('Error creating newsletter subscription: ', error));
    }

    async contactPageItems() {
        await this.cmsItems.getItem('contact', 1)
            .then((contact) => {
                let page: Contact = {
                    title: contact.title,
                    contactText: contact.contact_text,
                    email: contact.email,
                    phone: contact.phone,
                    address: contact.address,
                    abn: contact.abn,
                    businessName: contact.business_name,
                    socialMedia: contact.social_media,
                    seoIndex: contact.seo_settings,
                    seo: undefined
                };
                this.getLinkIds().then(data => {
                    this.socialLinks(data).then(links => {
                        page.socialMedia = links;
                        this.content.next(page);
                    });
                });
                this.content.next(page);
            })
            .catch(error => console.log('Error getting contact information items: ', error));
    }

    async subscribeNewsletter(name: string, emailAddress: string) {
        await this.cmsItems.createItem('newsletter_subscribers', { name: name, email: emailAddress })
            .catch(error => console.log('Error creating newsletter subscription: ', error));
    }

    private async getLinkIds() {
        let ids: string = '';
        await this.cmsItems.getItems('contact_site_map_link', { fields: 'site_map_link_id' })
            .then(result => {
                result.data.forEach(id => {
                    ids = ids.concat(id.site_map_link_id + ', ');
                });
            })
            .catch(error => console.log('Error getting contact link ids: ', error));
        return ids;
    }

    private async socialLinks(ids: string) {
        let allLinks: SiteMapLink[] = [];
        await this.cmsItems.getItems('site_map_link', { filter: { id: { in: ids } } })
            .then(results => {
                let links: SiteMapLink[] = results.data.map(item => {
                    let link: SiteMapLink = {
                        id: item.id,
                        name: item.link_text,
                        url: item.url,
                        group: item.link_group
                    }
                    return link;
                })
                allLinks = links;
            })
            .catch(error => console.log('Error getting sitemap items: ', error));
        return allLinks;
    }
}
