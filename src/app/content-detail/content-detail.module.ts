import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnersModule } from '../spinners/spinners.module';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { ArtworkDetailComponent } from './artwork-detail/artwork-detail.component';



@NgModule({
    declarations: [
        ArtistDetailComponent,
        ArtworkDetailComponent
    ],
    imports: [
        CommonModule,
        SpinnersModule
    ],
    exports: [
        ArtistDetailComponent,
        ArtworkDetailComponent
    ]
})
export class ContentDetailModule { }
