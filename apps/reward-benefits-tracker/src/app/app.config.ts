import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { firebaseConfig } from '@billhokc/auth';

import { routes } from './app.routes';
import { UserBenefitsFirestore } from './domains/credit-card-benefits/data-access/user-benefits-firestore';
import { UserBenefitsStorage } from './domains/credit-card-benefits/data-access/user-benefits-storage';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideAnimationsAsync(),
        provideRouter(routes),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        UserBenefitsFirestore,
        { provide: UserBenefitsStorage, useExisting: UserBenefitsFirestore },
    ],
};
