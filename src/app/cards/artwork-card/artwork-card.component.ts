import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Artwork } from 'src/app/models/artwork.model';

@Component({
    selector: 'app-artwork-card',
    templateUrl: './artwork-card.component.html',
    styleUrls: ['./artwork-card.component.scss']
})
export class ArtworkCardComponent implements OnInit {

    artwork: Artwork;
    @Input() artworkData: Artwork;
    @Output() openArtwork = new EventEmitter<number>();

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.artwork = this.artworkData;
    }

    viewArtworkDetail() {
        //this.openArtwork.emit(this.artwork.id);
        this.router.navigate(['/artwork/' + this.artwork.id]);
    }

    viewArtist() {
        this.router.navigate(['/artist/' + this.artwork.artistId]);
    }
}
