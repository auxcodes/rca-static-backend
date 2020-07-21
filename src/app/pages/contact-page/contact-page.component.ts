import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CMSImage } from '../../models/cms-image.model';
import { Contact } from '../../models/contact.model';
import { ContactService } from '../../services/pages/contact.service';
import { SeoService } from '../../services/seo.service';
import { SiteSettingsService } from '../../services/site-settings.service';
import { FacebookSdkService } from '../../services/utils/facebook-sdk.service';
import { Seo } from '../../models/seo.model';

@Component({
    selector: 'app-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit, OnDestroy {

    contactPage: Contact = {
        title: 'Say Hello',
        contactText: '',
        email: '',
        phone: '',
        address: '',
        abn: '',
        businessName: '',
        socialMedia: [],
        seoIndex: 0,
        seo: undefined
    };

    logo: CMSImage = {};

    submitted = false;
    contacted = false;
    contactForm: FormGroup;

    constructor(
        private titleService: Title,
        private contactService: ContactService,
        private seoService: SeoService,
        private siteSettings: SiteSettingsService,
        private formBuilder: FormBuilder,
        private fbSdkService: FacebookSdkService) {
        this.contactForm = formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
            message: ['', [Validators.required, Validators.minLength(6)]]
        })
    }

    ngOnInit() {
        this.contactService.getContent();
        this.contactService.content.subscribe((data) => {
            if (data.title !== '') {
                this.contactPage = data;
                this.titleService.setTitle(this.contactPage.title);
                this.seoService.setMetaTags(this.contactPage.seoIndex).then(seo => {
                    this.setupFacebookShare(seo);
                });
            }
        });
        this.siteSettings.content.subscribe(data => this.logo = data.siteLogo);
    }

    ngOnDestroy() {
        this.fbSdkService.resetShareButton();
    }

    private setupFacebookShare(seo: Seo) {
        this.fbSdkService.sdkSettings.subscribe(sdkData => {
            if (sdkData.appId !== '') {
                this.fbSdkService.setShareButton({
                    dataShare: true,
                    dataWidth: '',
                    dataShowFaces: true,
                    dataLayout: 'button_count',
                    dataSize: 'small',
                    dataHref: 'https://rca.aux.codes/contact',
                    showShare: true
                });
                this.fbSdkService.updateShareMetaTags({
                    fbAppId: sdkData.appId,
                    ogUrl: 'https://rca.aux.codes/contact',
                    ogType: 'website',
                    ogTitle: seo.title,
                    ogDescription: seo.description,
                    ogImage: 'https://api.risecommunityart.com.au/uploads/_/originals/logo-medium-784w.png',
                    ogImageAlt: 'RISE Community Art Logo',
                });
            }
        });
    }

    // convenience getter for easy access to form fields
    get conForm() { return this.contactForm.controls; }

    onSubmit(formValues) {
        this.contacted = false;
        this.submitted = true;

        // stop here if form is invalid
        if (this.contactForm.invalid) {
            return;
        }

        // send email to cms
        this.contactService.sendMessage(formValues.name, formValues.email, formValues.message)
            .then(() => {
                this.submitted = false;
                this.contacted = true;
                this.contactForm.reset();
            })
            .catch(error => console.log('Error subscribing to newsletter: ', error));
    }

}
