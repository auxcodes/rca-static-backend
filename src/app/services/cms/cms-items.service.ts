import { Injectable } from '@angular/core';
import { CmsClientService } from './cms-client.service';

@Injectable({
    providedIn: 'root'
})
export class CmsItemsService {

    constructor(private cmsClient: CmsClientService) { }

    async getItems(collection: string, params?: object) {
        try {
            return this.cmsClient.client.getItems(collection, params);
        }
        catch (e) {
            console.log('Error getting items: ', e);
            return;
        }
    }

    async getItem(collection: string, primaryKey: number, params?: object) {
        try {
            return this.cmsClient.client.getItem(collection, primaryKey, params);
        }
        catch (e) {
            console.log('Error getting item: ', e);
            return;
        }
    }

    async updateItem(collection: string, primaryKey: number, body: object) {
        try {
            return this.cmsClient.client.updateItem(collection, primaryKey, body);
        }
        catch (error) {
            console.log('Error updating item: ', error);
            return;
        }
    }

    async createItem(collection: string, body: object) {
        try {
            return this.cmsClient.client.createItem(collection, body);
        }
        catch (error) {
            console.log('Error creating item: ', error);
            return;
        }
    }
}
