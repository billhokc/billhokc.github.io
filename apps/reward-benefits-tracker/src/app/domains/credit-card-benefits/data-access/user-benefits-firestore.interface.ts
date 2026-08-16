import { Observable } from "rxjs";
import { UserBenefits } from "../models/user/user-benefits";
import { InjectionToken } from "@angular/core";

export interface UserBenefitsFirestore {
    saveData(data: UserBenefits): Observable<void>;
    getData(): Observable<UserBenefits | null>;
    getTotalBenefitsRedeemedYTD(): Observable<number>;
}

export const USER_BENEFITS_FIRESTORE = new InjectionToken<UserBenefitsFirestore>(
    'USER_BENEFITS_FIRESTORE'
)
