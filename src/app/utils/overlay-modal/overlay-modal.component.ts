import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-overlay-modal',
    templateUrl: './overlay-modal.component.html',
    styleUrls: ['./overlay-modal.component.scss']
})
export class OverlayModalComponent implements OnInit {

    @Input() content = "<h1>Loading...</h1>";
    @Output() closeModal = new EventEmitter<boolean>();

    constructor() { }

    ngOnInit(): void {
        console.log(this.content)
    }

    onClose() {
        this.closeModal.emit(false);
    }

}
