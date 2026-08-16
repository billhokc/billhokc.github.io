import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Route } from '@angular/router';
import { UserBenefitsFirestoreService } from './domains/credit-card-benefits/data-access/user-benefits-firestore.service';
import { USER_BENEFITS_FIRESTORE } from './domains/credit-card-benefits/data-access/user-benefits-firestore.interface';

export const rewardTrackerRoutes: Route[] = [
    {
        path: '',
        providers: [
            provideFirestore(() => getFirestore()),
            { provide: USER_BENEFITS_FIRESTORE, useClass: UserBenefitsFirestoreService },
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
