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
        await this.cmsClient.getImage(index)
            .then(item => image = item)
            .catch(error => console.log('Error getting image: ', error));

        if (image === undefined) {
            console.log("get image", index);
            image = this.brokenImage;
        }

        return this.mapImage(index, image);
    }

    async getImages(artworId: number): Promise<CMSImage[]> {
        let images: any[];
        await this.cmsClient.getItems('artwork_directus_files', { filter: { artwork_id: { eq: artworId } } })
            .then(items => images = items)
            .catch(error => console.log('Error getting images: ', error));

        if (images.length === 0) {
            images = [this.brokenImage];
        }

        return await Promise.all(images.map(data => this.getImage(data.directus_files_id)));
    }

    resizeImageUrl(imageFileName: string, size: number, quality: string) {
        return environment.rootDir + imageFileName;
    }

    mapImage(index: number, item: any): CMSImage {
        try {
            const image: CMSImage = item !== undefined ? {
                id: index,
                filename: item.filename,
                height: item.height,
                width: item.width,
                relativeUrl: item.url,
                url: item.url,
                thumbnailRelativeUrl: item.url,
                thumbnailUrl: item.url,
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
