import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { FacebookSdk } from '../../models/facebook-sdk.model';
import { FacebookShare } from '../../models/facebook-share.model';
import { CmsItemsService } from '../cms/cms-items.service';
import { BehaviorSubject } from 'rxjs';
import { FacebookMeta } from '../../models/facebook-meta.model';

declare const FB;

@Injectable({
    providedIn: 'root'
})
export class FacebookSdkService {

    sdkSettings: BehaviorSubject<FacebookSdk> = new BehaviorSubject<FacebookSdk>({
        appId: '',
        status: false,
        xfbml: true
    });

    shareSettings: BehaviorSubject<FacebookShare> = new BehaviorSubject<FacebookShare>({
        dataShare: true,
        dataWidth: '',
        dataShowFaces: true,
        dataLayout: 'button_count',
        dataSize: 'small',
        dataHref: 'https://rca.aux.codes',
        showShare: false
    });

    sdkInitialised: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private cmsItemService: CmsItemsService, private metaService: Meta) { }

    async getSdkSettings(): Promise<boolean> {
        let result = false;
        //await this.cmsItemService.getItem('facebook_settings', 1, { fields: 'app_id, status, xfbml' })
        //    .then(settings => {
        //        this.sdkSettings.next({
        //            appId: settings.data.app_id,
        //            status: settings.data.status,
        //            xfbml: settings.data.xfbml
        //        });
        //        result = true;
        //    })
        //    .catch(error => console.error('Error getting FB SDK settings: ', error));
        return result;
    }

    addSDK(scriptData: FacebookSdk) {
        if (!this.sdkInitialised.value) {
            try {
                const appRoot = document.getElementsByTagName('app-root')[0];

                const scriptElement = document.createElement('script');

                scriptElement.id = 'facebook-jssdk';
                scriptElement.src = 'https://connect.facebook.net/en_US/sdk.js';
                scriptElement.async = true;
                scriptElement.defer = true;

                scriptElement.onload = () => {
                    FB.init({
                        appId: scriptData.appId,
                        status: scriptData.status,
                        xfbml: scriptData.xfbml,
                        version: 'v6.0'
                    });
                    FB.AppEvents.logPageView();
                    this.sdkInitialised.next(true);
                };

                scriptElement.onerror = (error) => {
                    console.log("Couldn't initialise Facebook SDK script: ", scriptElement.src, error);
                    this.sdkInitialised.next(false);
                    return;
                };

                appRoot.parentNode.insertBefore(scriptElement, appRoot);
            }
            catch (error) {
                console.error('Failed to add Facebook SDK script: ', error);
                this.sdkInitialised.next(false);
            }
        }
    }

    setShareButton(shareSettings: FacebookShare) {
        this.shareSettings.next(shareSettings);
    }

    resetShareButton() {
        this.shareSettings.next({
            dataShare: true,
            dataWidth: '',
            dataShowFaces: true,
            dataLayout: 'button_count',
            dataSize: 'small',
            dataHref: 'https://rca.aux.codes',
            showShare: true
        });
        this.updateShareMetaTags({
            fbAppId: this.sdkSettings.value.appId,
            ogUrl: 'https://rca.aux.codes',
            ogType: 'website',
            ogTitle: 'RISE Community Art',
            ogDescription: 'RISE Community Art Store is a not for profit organisation providing a space for Aboriginal artists to display and sell their work to the public.',
            ogImage: 'assets/static-content/images/logo-medium-784w.png',
            ogImageAlt: 'RISE Community Art Logo',
        });
    }

    updateShareMetaTags(shareData: FacebookMeta) {
        this.metaService.updateTag({ property: 'fb:app_id', content: shareData.fbAppId });
        this.metaService.updateTag({ property: 'og:url', content: shareData.ogUrl });
        this.metaService.updateTag({ property: 'og:type', content: shareData.ogType });
        this.metaService.updateTag({ property: 'og:title', content: shareData.ogTitle });
        this.metaService.updateTag({ property: 'og:description', content: shareData.ogDescription });
        this.metaService.updateTag({ property: 'og:image', content: shareData.ogImage });
        this.metaService.updateTag({ property: 'og:image:alt', content: shareData.ogImageAlt });

        this.fbXfbmlParse();
    }

    fbXfbmlParse() {
        if (this.sdkInitialised.value) {
            FB.XFBML.parse();
        }
    }
}
