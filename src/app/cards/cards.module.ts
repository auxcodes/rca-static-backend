import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpinnersModule } from '../spinners/spinners.module';
import { ArtistCardComponent } from './artist-card/artist-card.component';
import { ArtworkCardComponent } from './artwork-card/artwork-card.component';
import { BlogPostCardComponent } from './blog-post-card/blog-post-card.component';



@NgModule({
    declarations: [
        ArtworkCardComponent,
        ArtistCardComponent,
        BlogPostCardComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        SpinnersModule
    ],
    exports: [
        ArtworkCardComponent,
        ArtistCardComponent,
        BlogPostCardComponent
    ]
})
export class CardsModule { }
