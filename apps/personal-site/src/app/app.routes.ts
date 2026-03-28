import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.HomePage),
  },
  {
    path: 'reward-benefits-tracker',
    loadChildren: () =>
      import('@billhokc/reward-benefits-tracker').then(
        (m) => m.rewardTrackerRoutes,
      ),
  },
];
