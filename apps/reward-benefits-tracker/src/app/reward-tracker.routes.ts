import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Route } from '@angular/router';
import { UserBenefitsFirestore } from './domains/credit-card-benefits/data-access/user-benefits-firestore';
import { UserBenefitsStorage } from './domains/credit-card-benefits/data-access/user-benefits-storage';

export const rewardTrackerRoutes: Route[] = [
    {
        path: '',
        providers: [
            provideFirestore(() => getFirestore()),
            UserBenefitsFirestore,
            { provide: UserBenefitsStorage, useExisting: UserBenefitsFirestore },
        ],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./domains/dashboard/dashboard').then(
                        (m) => m.Dashboard,
                    ),
            },
            {
                path: 'benefits/:cardId',
                loadComponent: () =>
                    import(
                        './domains/credit-card-benefits/credit-card-benefits'
                    ).then((m) => m.CreditCardBenefits),
            },
        ],
    },
];
