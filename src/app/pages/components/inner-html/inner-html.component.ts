import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-inner-html',
    templateUrl: './inner-html.component.html',
    styleUrls: ['./inner-html.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InnerHtmlComponent {

    @Input() htmlContent: string;

    constructor(private sanitizer: DomSanitizer) { }

    getContent() {
        return this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
    }
}
