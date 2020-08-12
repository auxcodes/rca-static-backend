import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VisitHistory } from '../../models/visit-history.model';

@Injectable({
  providedIn: 'root'
})
export class DemoSiteModalService {

    isModalShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    visitHistory: BehaviorSubject<VisitHistory> = new BehaviorSubject<VisitHistory>({ lastVisit: null, seenNotification: null });

    constructor() {
        this.loadHistory();
    }

    saveHistory() {
        this.updateHistory(true);
    }

    loadHistory() {
        if (sessionStorage.getItem('rca_aux_codes')) {
            this.visitHistory.next(JSON.parse(sessionStorage.getItem('rca_aux_codes')));
        }
        else {
            this.updateHistory(false);
        }
    }

    private updateHistory(seenNotification: boolean) {
        this.visitHistory.next({
            lastVisit: (new Date().getMilliseconds()),
            seenNotification: seenNotification
        });
        sessionStorage.setItem('rca_aux_codes', JSON.stringify(this.visitHistory.value));
    }
}
