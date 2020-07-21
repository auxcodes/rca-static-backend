import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArtworkSpinnerComponent } from 'src/app/spinners/artwork-spinner/artwork-spinner.component';


@NgModule({
    declarations: [
        ArtworkSpinnerComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArtworkSpinnerComponent
    ]
})
export class SpinnersModule { }
