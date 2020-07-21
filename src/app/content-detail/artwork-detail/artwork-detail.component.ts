import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Artwork } from 'src/app/models/artwork.model';

@Component({
    selector: 'app-artwork-detail',
    templateUrl: './artwork-detail.component.html',
    styleUrls: ['./artwork-detail.component.scss']
})
export class ArtworkDetailComponent implements OnInit {

    artwork: Artwork;
    imageIndex: number = 0;
    @Input() artworkData: Artwork;
    @Output() closeArtwork = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit() {
        this.artwork = this.artworkData;
    }

    onClose() {
        // changes open state to false
        this.closeArtwork.emit(false);
    }

    onNextImage() {
        if ((this.imageIndex + 1) === this.artwork.images.length) {
            this.imageIndex = 0;
        }
        else {
            this.imageIndex += 1;
        }
    }

    onZoomImage(imageId: number) {
        this.imageIndex = this.artwork.images.findIndex(art => art.id === imageId);
    }

}
