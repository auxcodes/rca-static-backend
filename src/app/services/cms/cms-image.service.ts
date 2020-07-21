import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CMSImage } from '../../models/cms-image.model';
import { CmsClientService } from './cms-client.service';


@Injectable({
    providedIn: 'root'
})
export class CmsImageService {

    brokenImage: CMSImage = {
        id: 0,
        filename: 'image.svg',
        height: 24,
        width: 24,
        relativeUrl: 'assets/icons/broken_image/image.svg',
        url: 'assets/icons/broken_image/image.svg',
        thumbnailRelativeUrl: 'assets/icons/broken_image/image.svg',
        thumbnailUrl: 'assets/icons/broken_image/image.svg'
    }

    constructor(private cmsClient: CmsClientService) { }

    async getImage(index: number): Promise<CMSImage> {
        let image: any;
        await this.cmsClient.client.get(`/files/${index}`)
            .then(item => image = item.data)
            .catch(error => console.log('Error getting image: ', error));

        if (image === undefined) {
            image = this.brokenImage;
        }

        return this.mapImage(index, image);
    }

    async getImages(artworId: number): Promise<CMSImage[]> {
        let images: any[];
        await this.cmsClient.client.getItems('artwork_directus_files', { filter: { artwork_id: { eq: artworId } } })
            .then(items => images = items.data)
            .catch(error => console.log('Error getting images: ', error));

        if (images.length === 0) {
            images = [this.brokenImage];
        }

        return await Promise.all(images.map(data => this.getImage(data.directus_files_id)));
    }

    resizeImageUrl(imageFileName: string, size: number, quality: string) {
        return environment.rootDir + '/thumbnail/_/' + size + '/' + size + '/contain/' + quality + '/' + imageFileName;
    }

    mapImage(index: number, item: any): CMSImage {
        try {
            const image: CMSImage = item.data !== undefined ? {
                id: index,
                filename: item.filename,
                height: item.height,
                width: item.width,
                relativeUrl: item.data.url,
                url: environment.rootDir + item.data.url,
                thumbnailRelativeUrl: '/thumbnail/_/250/250/crop/okay/' + item.filename,
                thumbnailUrl: environment.rootDir + '/thumbnail/_/250/250/crop/okay/' + item.filename,
                altText: item.title
            } : this.brokenImage;
            return image;
        }
        catch (error) {
            console.log('Error mapping image: ', error);
            return this.brokenImage;
        }

    }
}
