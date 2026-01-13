import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBenefits } from '../models/user/user-benefits';

@Injectable()
export abstract class UserBenefitsStorage {
    abstract saveData(data: UserBenefits): void;
    abstract getData(): Observable<UserBenefits | null>;
    abstract getTotalBenefitsRedeemedYTD(): Observable<number>;
}

export function computeTotalBenefitsRedeemedYTD(data: UserBenefits | null): number {
    const yearlyTotal =
        data?.yearly.reduce(
            (total, benefit) => total + benefit.amounts.reduce((sum, a) => sum + a, 0),
            0,
        ) ?? 0;
    const monthlyTotal =
        data?.monthly.reduce(
            (total, month) =>
                total +
                month.amountUsed.reduce(
                    (sum, amount) => sum + amount.amounts.reduce((s, a) => s + a, 0),
                    0,
                ),
            0,
        ) ?? 0;
    return yearlyTotal + monthlyTotal;
}


