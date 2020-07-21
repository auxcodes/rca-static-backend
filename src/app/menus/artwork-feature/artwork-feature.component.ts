import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { DomSanitizer } from '@angular/platform-browser';
import { Artwork } from '../../models/artwork.model';
import { CarouselOptions } from '../../models/carousel-options.model';

@Component({
    selector: 'artwork-carousel',
    templateUrl: './artwork-feature.component.html',
    styleUrls: ['./artwork-feature.component.scss']
})
export class ArtworkFeatureComponent implements AfterViewInit, OnDestroy {

    @ViewChild('carouselOuter') private carouselOuter: ElementRef;
    @ViewChild('carousel') private carousel: ElementRef;

    @Input() items: Artwork[] = [];
    @Input() options: CarouselOptions = {
        autoScroll: false,
        autoScrollTime: 3000,
        showControls: true,
        scrollSpeed: '1000ms ease-in-out',
        imageSpacing: 10,
    };

    private player: AnimationPlayer;
    private itemWidth: number;
    private currentSlide = 0;
    private lastSlide = 0;
    private autoScrollNext = true;
    carouselSliderStyle = {};
    carouselItemStyle = {};
    itemStyle = {};

    timeout: NodeJS.Timeout;

    constructor(private builder: AnimationBuilder, private sanitizer: DomSanitizer, ) { }

    ngAfterViewInit() {
        this.timeout = setTimeout(() => { }, 0);
        this.resizeCarousel();
        this.resetTimeout(this.autoScrollNext);
    }

    ngOnDestroy() {
        clearTimeout(this.timeout);
        clearInterval(this.timeout);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.resizeCarousel();
    }

    autoScroll() {
        this.lastSlide = this.currentSlide;

        if (this.autoScrollNext) {
            this.currentSlide = (this.currentSlide + 1) % this.items.length;
        }
        else {
            this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
        }

        this.moveCarousel();
        this.resetTimeout(this.autoScrollNext);
        this.scrollPositionColour(this.lastSlide.toString(), this.currentSlide.toString());

        if (this.autoScrollNext && this.currentSlide + 1 === this.items.length) {
            this.autoScrollNext = false;
        }
        if (!this.autoScrollNext && this.currentSlide === 0) {
            this.autoScrollNext = true;
        }
    }

    next() {
        if ((this.currentSlide + 1) < this.items.length) {
            this.lastSlide = this.currentSlide;
            this.currentSlide = (this.currentSlide + 1) % this.items.length;
            this.moveCarousel();
            this.resetTimeout(true);
            this.scrollPositionColour(this.lastSlide.toString(), this.currentSlide.toString());
        }
        else {
            this.currentSlide = this.items.length - 1;
            this.resetTimeout(false);
        }
    }

    prev() {
        if (this.currentSlide > 0) {
            this.lastSlide = this.currentSlide;
            this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
            this.moveCarousel();
            this.resetTimeout(false);
            this.scrollPositionColour(this.lastSlide.toString(), this.currentSlide.toString());
        }
        else {
            this.currentSlide = 0;
            this.resetTimeout(true);
        }
    }

    backgroundImage(url: string) {
        const srcUrl: string = url === undefined ? 'url(assets/icons/broken_image/image.svg)' : 'url(' + url + ')';
        return this.sanitizer.bypassSecurityTrustStyle(srcUrl);
    }


    private resizeCarousel() {
        const totalWidth: string = (this.carouselOuter.nativeElement.clientWidth * this.items.length) + 'px';
        this.carouselSliderStyle = { width: `${totalWidth}px` };
        this.itemWidth = this.carouselOuter.nativeElement.clientWidth;
        this.carouselItemStyle = { width: `${this.itemWidth}px` };
        this.itemStyle = { width: `${(this.itemWidth - (2 * this.options.imageSpacing)) - 2}px`, margin: `${this.options.imageSpacing}px` };
        this.moveCarousel();
    }

    private moveCarousel() {
        const offset = this.currentSlide * this.itemWidth;
        if (offset !== null) {
            const myAnimation: AnimationFactory = this.buildAnimation(offset);
            this.player = myAnimation.create(this.carousel.nativeElement);
            this.player.play();
        }
    }

    private buildAnimation(offset) {
        return this.builder.build([
            animate(this.options.scrollSpeed, style({ transform: `translateX(-${offset}px)` }))
        ]);
    }

    private resetTimeout(scrollNext: boolean) {
        if (this.options.autoScroll) {
            clearTimeout(this.timeout);
            this.timeout = setInterval(() => { this.autoScroll(); }, this.options.autoScrollTime);
            this.autoScrollNext = scrollNext;
        }
    }

    private scrollPositionColour(inactiveId: string, activeId: string) {
        if (this.items && this.items.length > 1) {
            if (inactiveId !== '') {
                document.getElementById(inactiveId).className = 'dot';
            }
            document.getElementById(activeId).className = 'active-dot';
        }
    }
}
