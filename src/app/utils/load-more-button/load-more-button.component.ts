import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-load-more-button',
    templateUrl: './load-more-button.component.html',
    styleUrls: ['./load-more-button.component.scss']
})
export class LoadMoreButtonComponent implements OnInit {

    @Input() buttonText = 'Load More...';
    @Output() moreStuff = new EventEmitter();
    constructor() { }

    ngOnInit() {
    }

    onLoadMore() {
        this.moreStuff.emit();
    }

}
