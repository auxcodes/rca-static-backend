import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Artist } from 'src/app/models/artist.model';

@Component({
    selector: 'app-artist-detail',
    templateUrl: './artist-detail.component.html',
    styleUrls: ['./artist-detail.component.scss']
})
export class ArtistDetailComponent implements OnInit {

    artist: Artist;
    @Input() artistData: Artist;
    @Output() closeArtist = new EventEmitter<boolean>();
    @Output() viewArtwork = new EventEmitter<number>();

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.artist = this.artistData;
    }

    onClose() {
        // changes open state to false
        this.closeArtist.emit(false);
    }

    viewArtistsArtwork() {
        this.viewArtwork.emit(this.artist.id);
    }

    backgroundImage() {
        const srcUrl: string = 'url(' + this.artist.photo.url + ')';
        return this.sanitizer.bypassSecurityTrustStyle(srcUrl);
    }
}
