import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SortOption } from '../../../models/sort-option.model';

@Component({
    selector: 'app-sort-bar',
    templateUrl: './sort-bar.component.html',
    styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent implements OnInit {

    @Input() sortOptions: SortOption[] = [{ name: 'loading', text: 'Loading...', value: null }];
    @Output() sortSelected = new EventEmitter<number>();

    constructor() { }

    ngOnInit(): void {
    }

    onSort(event) {
        this.sortSelected.emit(event.target.selectedIndex * 1);
        console.log("Sort Bar - onSort(): ", event.target.selectedIndex * 1);
    }
}
