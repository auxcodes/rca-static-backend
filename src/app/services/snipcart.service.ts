import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GalleryService } from './pages/gallery.service';
import { DemoSiteModalService } from './utils/demo-site-modal.service';

declare const Snipcart;

@Injectable({
    providedIn: 'root'
})
export class SnipcartService {

    scriptLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    isCartOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    userEmail: BehaviorSubject<string> = new BehaviorSubject<string>('');
    isModalShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private galleryService: GalleryService,
        private visitHistory: DemoSiteModalService) {

    }

    addCartReadyListener() {
        document.addEventListener('snipcart.ready', (event) => {
            Snipcart.DEBUG = environment.cartDebug;
            this.cartSubscription();
            this.userSubscription();
            this.orderSubscription();
            let loggedIn = Snipcart.api.user.current() ? true : false;
            this.isLoggedIn.next(loggedIn);
        });
    }


    private cartSubscription() {
        Snipcart.subscribe('cart.opened', () => {
            this.isCartOpen.next(true);
            this.cartOpened();
        });
        Snipcart.subscribe('cart.closed', () => {
            this.isCartOpen.next(false);
            this.cartClosed();
        });
        Snipcart.subscribe('item.added', item => {
            this.itemAdded(item); // gtm 
        });
        Snipcart.subscribe('item.removed', item => {
            this.itemRemoved(item); // all ready tracked
        });
        Snipcart.subscribe('page.change', page => {
            this.pageChanged(page);
        });
    }

    private cartOpened() {
        (window as any).dataLayer.push({
            event: 'snipcartEvent',
            eventCategory: 'Cart Action',
            eventAction: 'Cart Opened',
            ecommerce: {
                cartclose: {
                    products: this.createProductsFromItems(Snipcart.api.items.all())
                }
            }
        });
    }

    private cartClosed() {
        (window as any).dataLayer.push({
            event: 'snipcartEvent',
            eventCategory: 'Cart Action',
            eventAction: 'Cart Closed',
            ecommerce: {
                cartopen: {
                    products: this.createProductsFromItems(Snipcart.api.items.all())
                }
            }
        });
    }

    private itemAdded(item) {
        this.visitHistory.isModalShown.next(true);
        (window as any).dataLayer.push({
            event: 'snipcartEvent',
            eventCategory: 'Cart Update',
            eventAction: 'New Item Added To Cart',
            eventLabel: item.name,
            eventValue: item.price,
            ecommerce: {
                currencyCode: 'AUD',
                add: {
                    products: this.createProductsFromItems([item])
                }
            }
        });
    }

    private itemRemoved(item) {
        (window as any).dataLayer.push({
            event: 'snipcartEvent',
            eventCategory: 'Cart Update',
            eventAction: 'Item Removed From Cart',
            eventLabel: item.name,
            eventValue: item.price,
            ecommerce: {
                currencyCode: 'AUD',
                remove: {
                    products: this.createProductsFromItems([item])
                }
            }
        });
    }

    private pageChanged(page) {
        (window as any).dataLayer.push({
            event: 'snipcartEvent',
            eventCategory: 'Page Change',
            eventAction: page,
            ecommerce: {
                checkout: {
                    products: this.createProductsFromItems(Snipcart.api.items.all())
                }
            }
        });
    }

    private userSubscription() {

        Snipcart.subscribe('user.loggedout', () => {
            this.isLoggedIn.next(false);
            this.userEmail.next('');
        });
        Snipcart.subscribe('authentication.success', (email) => {
            this.isLoggedIn.next(true);
            this.userEmail.next(email);
        });
    }

    private orderSubscription() {
        Snipcart.subscribe('order.completed', (order) => {
            const items: any[] = order.items;
            items.forEach((item) => {
                this.galleryService.markAsSold(item.id);
            });
            this.orderCompleted(order);
        });
    }

    private orderCompleted(order) {
        (window as any).dataLayer.push({
            event: 'snipcartEvent',
            eventCategory: 'Order Update',
            eventAction: 'New Order Completed',
            ecommerce: {
                currencyCode: order.currency,
                purchase: {
                    actionField: {
                        id: order.token,
                        affiliation: 'Website',
                        revenue: order.total,
                        tax: order.taxesTotal,
                        shipping: order.shippingInformation.fees,
                        invoiceNumber: order.invoiceNumber
                    },
                    products: this.createProductsFromItems(order.items),
                    userId: order.user.id
                }
            }
        });
    }

    private createProductsFromItems(items) {
        return items.map(item => {
            return {
                name: item.name,
                description: item.description,
                id: item.id,
                price: item.price,
                quantity: item.quantity
            };
        });
    }

    addScript() {
        let scriptElement = document.createElement("script");
        scriptElement.src = environment.cartApiUrl;
        scriptElement.id = "snipcart";
        scriptElement.setAttribute("data-api-key", environment.cartApiKey);

        scriptElement.onload = () => {
            this.scriptLoaded.next(true);
        };

        scriptElement.onerror = (error: any) => {
            console.log("Couldn't load script ", environment.cartApiUrl, error);
        };

        document.getElementsByTagName('head')[0].appendChild(scriptElement);

        //this.snipcart = window.Snipcart.api
    }

    loggedIn() {

    }
}
