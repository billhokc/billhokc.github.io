import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserBenefits } from '../models/user/user-benefits';

@Injectable()
export abstract class UserBenefitsStorage {
    abstract saveData(data: UserBenefits): void;
    abstract getData(): Observable<UserBenefits | null>;
    abstract getTotalBenefitsRedeemedYTD(): Observable<number>;
}