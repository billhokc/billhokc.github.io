import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { UserBenefits } from '../models/user/user-benefits';
import { UserBenefitsStorage } from './user-benefits-storage';
import { computeTotalBenefitsRedeemedYTD } from '../util/benefit-calculation';

@Injectable({
    providedIn: 'root',
})
export class UserBenefitsLocalStorage extends UserBenefitsStorage {
    private readonly storageKey = 'userBenefits';

    saveData(data: UserBenefits): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    getData(): Observable<UserBenefits | null> {
        const raw = localStorage.getItem(this.storageKey);
        return of(raw ? (JSON.parse(raw) as UserBenefits) : null);
    }

    getTotalBenefitsRedeemedYTD(): Observable<number> {
        return this.getData().pipe(map((data) => computeTotalBenefitsRedeemedYTD(data)));
    }
}
