import { Injectable } from '@angular/core';
import { CmsClientService } from './cms-client.service';

@Injectable({
    providedIn: 'root'
})
export class CmsCollectionsService {

    constructor(private cmsClient: CmsClientService) { }

    async getCollections() {
        try {
            return this.cmsClient.client.getCollections();
        }
        catch (e) {
            console.log('Error getting collection: ', e);
            return [];
        }
    }

    async getCollection(name: string) {
        let collection: any;
        try {
            return collection = this.cmsClient.client.getCollection(name);
        }
        catch (e) {
            console.log('Error getting collection: ', e);
            return;
        }
    }
}
