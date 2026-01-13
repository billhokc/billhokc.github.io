import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { UserBenefitsFirestore } from './domains/credit-card-benefits/data-access/user-benefits-firestore';
import { UserBenefitsMigration } from './domains/credit-card-benefits/data-access/user-benefits-migration';
import { UserBenefitsStorage } from './domains/credit-card-benefits/data-access/user-benefits-storage';

function migrateUserBenefitsFactory(migration: UserBenefitsMigration): () => Promise<void> {
    return () => migration.migrateLocalStorageToFirebaseOnce();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        // provideRouter(routes, withComponentInputBinding()),
        // {
        //     provide: APP_INITIALIZER,
        //     multi: true,
        //     useFactory: migrateUserBenefitsFactory,
        //     deps: [UserBenefitsMigration],
        // },
        { provide: UserBenefitsStorage, useExisting: UserBenefitsFirestore },
    ],
};
