import { CommonModule } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { CreditCard } from '../../shared/models/creditCard';
import { BenefitsApi } from '../credit-card-benefits/data-access/benefits-api';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, MatSelectModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss',
})
export class Dashboard {
    selectedCreditCard: CreditCard | undefined;
    creditCardOptions: Signal<CreditCard[]>;

    constructor(
        private _router: Router,
        private _benefitsApi: BenefitsApi,
    ) {
        this.creditCardOptions = toSignal(this._benefitsApi.getCreditCards(), { initialValue: [] });
    }

    onCreditCardSelect(card: CreditCard | undefined) {
        this._router.navigate(['/benefits', card?.id]);
    }
}
