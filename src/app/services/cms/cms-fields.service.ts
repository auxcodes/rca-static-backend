import { Injectable } from '@angular/core';
import { CmsClientService } from './cms-client.service';

@Injectable({
    providedIn: 'root'
})
export class CmsFieldsService {

    constructor(private cmsClient: CmsClientService) { }

    async getFields(collection: string) {
        try {
            return this.cmsClient.client.getFields(collection);
        }
        catch (e) {
            console.log('Error getting fields: ', e);
            return;
        }
    }

    async getField(collection: string, fieldName: string, options: object) {
        try {
            return this.cmsClient.client.getField(collection, fieldName, options);
        }
        catch (e) {
            console.log('Error getting field: ', e);
            return;
        }
    }
}
