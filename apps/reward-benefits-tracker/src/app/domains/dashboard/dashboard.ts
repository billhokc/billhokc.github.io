import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditCard } from '../../shared/models/creditCard';
import { BenefitsApi } from '../credit-card-benefits/data-access/benefits-api';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, MatButtonModule, MatSelectModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    selectedCreditCard: CreditCard | undefined;
    creditCardOptions: Signal<CreditCard[]>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _benefitsApi: BenefitsApi,
    ) {
        this.creditCardOptions = toSignal(this._benefitsApi.getCreditCards(), { initialValue: [] });
    }

    onCreditCardSelect(card: CreditCard | undefined) {
        if (!card) {
            return;
        }

        this._router.navigate(['benefits', card.id], { relativeTo: this._route });
    }
}
