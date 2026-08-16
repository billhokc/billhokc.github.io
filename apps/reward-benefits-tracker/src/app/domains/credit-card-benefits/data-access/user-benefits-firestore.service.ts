import { inject, Injectable } from '@angular/core';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import type { DocumentData, DocumentReference } from 'firebase/firestore';
import { GoogleAuthService } from 'libs/shared/auth/src/lib/google-auth.service';
import { from, map, Observable, of, switchMap, take } from 'rxjs';
import { UserBenefits } from '../models/user/user-benefits';
import { computeTotalBenefitsRedeemedYTD } from '../util/benefit-calculation';

// Single-user mode: store data in one shared document.
// When auth is added later, switch docRef to users/{uid}/benefits/{year}.

@Injectable()
export class UserBenefitsFirestoreService {
    private readonly currentYear = new Date().getFullYear().toString();
    private firestore = inject(Firestore, { optional: true});
    private authService = inject(GoogleAuthService);

    private docRef$(): Observable<DocumentReference<DocumentData>> {
        if (!this.firestore) {
            throw new Error('Firestore is not initialized. Please configure Firestore to use UserBenefitsFirestore.');
        }

        return this.authService.getCurrentUser().pipe(
            take(1),
            switchMap((user) => {
                if (!user) {
                    throw new Error('User is not authenticated. Please log in to use UserBenefitsFirestore.');
                }
                return of(doc(this.firestore!, 'users', user.uid, 'benefits', this.currentYear) as DocumentReference<DocumentData>);
            }),
        );
    }

    isConfigured(): boolean {
        return !!this.firestore;
    }

    saveData(data: UserBenefits): Observable<void> {
        return this.docRef$().pipe(
            take(1),
            switchMap((ref) => from(setDoc(ref, data))),
        );
    }

    getData(): Observable<UserBenefits | null> {
        return this.docRef$().pipe(
            take(1),
            switchMap((ref) => from(getDoc(ref))),
            map((snapshot) => (snapshot.exists() ? (snapshot.data() as UserBenefits) : null)),
        );
    }

    getTotalBenefitsRedeemedYTD(): Observable<number> {
        return this.getData().pipe(map((data) => computeTotalBenefitsRedeemedYTD(data)));
    }
}
