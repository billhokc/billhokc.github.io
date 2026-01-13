import { Routes } from '@angular/router';
import { CreditCardBenefits } from './domains/credit-card-benefits/credit-card-benefits';
import { Dashboard } from './domains/dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: Dashboard,
    },
    {
        path: 'benefits/:cardId',
        component: CreditCardBenefits,
    },
];
