import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Artist } from 'src/app/models/artist.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-artist-card',
    templateUrl: './artist-card.component.html',
    styleUrls: ['./artist-card.component.scss']
})
export class ArtistCardComponent implements OnInit {

    artist: Artist;
    @Input() artistData: Artist;
    @Output() openArtist = new EventEmitter<number>();
    @Output() viewArtwork = new EventEmitter<number>();

    constructor(
        private router: Router,
        private sanitizer: DomSanitizer) {
        this.artist = {
            id: 1,
            name: "Name...",
            biography: "Biography...",
            thumbnail: "",
            artworks: []
        }
    }

    ngOnInit() {
        this.artist = this.artistData;
    }

    viewArtistsArtwork() {
        this.viewArtwork.emit(this.artist.id);
    }

    artistBiography() {
        return this.sanitizer.bypassSecurityTrustHtml(this.artist.biography);
    }

}
