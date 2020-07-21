import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagesService } from '../../services/pages.service';
import { ContactService } from '../../services/pages/contact.service';
import { Footer } from '../../models/footer.model';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    abn: string;
    address: string;
    name: string;
    phone: string;
    date = 2019;

    footer: Footer = {
        title: 'Newsletter',
        text: 'Sign up for news about new artwork and sales.',
        links: [],
        groups: []
    }

    submitted = false;
    subscribed = false;
    subscribeForm: FormGroup;

    constructor(
        private pagesService: PagesService,
        private contactService: ContactService,
        private formBuilder: FormBuilder) {
        this.subscribeForm = formBuilder.group({
            name: '',
            email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]]
        })
    }

    ngOnInit() {
        this.pagesService.getFooter().subscribe(footer => {
            this.footer = footer;
        });
        this.date = (new Date()).getFullYear();
        this.contactService.content.subscribe(item => {
            this.address = item.address;
            this.phone = item.phone;
            this.abn = item.abn;
            this.name = item.businessName;
        });
    }

    // convenience getter for easy access to form fields
    get subForm() { return this.subscribeForm.controls; }

    onSubscribe(formValues) {
        this.subscribed = false;
        this.submitted = true;

        // stop here if form is invalid
        if (this.subscribeForm.invalid) {
            return;
        }

        // send email to cms
        this.contactService.subscribeNewsletter(formValues.name, formValues.email)
            .then(() => {
                this.submitted = false;
                this.subscribed = true;
                this.subscribeForm.reset();
            })
            .catch(error => console.log('Error subscribing to newsletter: ', error));
    }
}
