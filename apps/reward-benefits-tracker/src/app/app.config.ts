import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { UserBenefitsFirestore } from './domains/credit-card-benefits/data-access/user-benefits-firestore';
import { UserBenefitsMigration } from './domains/credit-card-benefits/data-access/user-benefits-migration';
import { UserBenefitsStorage } from './domains/credit-card-benefits/data-access/user-benefits-storage';
import { routes } from './app.routes';

function migrateUserBenefitsFactory(migration: UserBenefitsMigration): () => Promise<void> {
    return () => migration.migrateLocalStorageToFirebaseOnce();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideAnimationsAsync(),
        provideRouter(routes),
        // {
        //     provide: APP_INITIALIZER,
        //     multi: true,
        //     useFactory: migrateUserBenefitsFactory,
        //     deps: [UserBenefitsMigration],
        // },
        { provide: UserBenefitsStorage, useExisting: UserBenefitsFirestore },
    ],
};
