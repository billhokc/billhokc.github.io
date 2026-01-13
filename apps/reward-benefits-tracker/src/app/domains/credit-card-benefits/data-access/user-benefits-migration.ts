import { Injectable } from '@angular/core';
import { UserBenefits } from '../models/user/user-benefits';
import { UserBenefitsFirestore } from './user-benefits-firestore';

@Injectable({
    providedIn: 'root',
})
export class UserBenefitsMigration {
    private readonly localStorageKey = 'userBenefits';
    private readonly migrationFlagKey = 'userBenefitsMigratedToFirebase';
    private readonly logPrefix = '[UserBenefitsMigration]';

    constructor(private readonly firestoreStorage: UserBenefitsFirestore) {}

    async migrateLocalStorageToFirebaseOnce(): Promise<void> {
        if (localStorage.getItem(this.migrationFlagKey) === 'true') {
            console.log(`${this.logPrefix} skipped: already migrated`);
            return;
        }

        if (!this.firestoreStorage.isConfigured()) {
            console.log(`${this.logPrefix} skipped: firestore not configured`);
            return;
        }

        const raw = localStorage.getItem(this.localStorageKey);
        if (!raw) {
            console.log(`${this.logPrefix} skipped: no local data found`);
            return;
        }

        try {
            console.log(`${this.logPrefix} starting migration to firestore`);
            const data = JSON.parse(raw) as UserBenefits;
            await this.firestoreStorage.saveDataAsync(data);
            localStorage.setItem(this.migrationFlagKey, 'true');
            console.log(`${this.logPrefix} migration complete`);
        } catch (error) {
            console.error('Failed to migrate local user benefits to Firestore:', error);
        }
    }
}
