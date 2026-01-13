import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { map, Observable } from 'rxjs';
import { UserBenefits } from '../models/user/user-benefits';
import { computeTotalBenefitsRedeemedYTD, UserBenefitsStorage } from './user-benefits-storage';

const firebaseConfig = {
    apiKey: 'AIzaSyDULaGuVZLfOxnKYwhPiF9yJ29INtyWu8Q',
    authDomain: 'rewardstracker-e67f1.firebaseapp.com',
    projectId: 'rewardstracker-e67f1',
    storageBucket: 'rewardstracker-e67f1.firebasestorage.app',
    messagingSenderId: '657152882417',
    appId: '1:657152882417:web:d6446a9c5ba80011eb5b50',
    measurementId: 'G-5FPSZM98ER',
};

// Single-user mode: store data in one shared document.
// When auth is added later, switch docRef to users/{uid}/benefits/{year}.

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Injectable({
    providedIn: 'root',
})
export class UserBenefitsFirestore extends UserBenefitsStorage {
    private readonly currentYear = new Date().getFullYear().toString();

    private get docRef() {
        return doc(db, 'benefits', this.currentYear);
    }

    isConfigured(): boolean {
        return firebaseConfig.apiKey.trim() !== '' && firebaseConfig.projectId.trim() !== '';
    }

    saveData(data: UserBenefits): void {
        this.saveDataAsync(data).catch((error) => {
            console.error('Failed to save benefits to Firestore:', error);
        });
    }

    async saveDataAsync(data: UserBenefits): Promise<void> {
        await setDoc(this.docRef, data);
    }

    getData(): Observable<UserBenefits | null> {
        return new Observable<UserBenefits | null>((subscriber) => {
            const unsubscribe = onSnapshot(
                this.docRef,
                (snapshot) => {
                    subscriber.next(snapshot.exists() ? (snapshot.data() as UserBenefits) : null);
                },
                (error) => {
                    console.error('Error reading benefits from Firestore:', error);
                    subscriber.error(error);
                },
            );
            return unsubscribe;
        });
    }

    getTotalBenefitsRedeemedYTD(): Observable<number> {
        return this.getData().pipe(map(computeTotalBenefitsRedeemedYTD));
    }
}
