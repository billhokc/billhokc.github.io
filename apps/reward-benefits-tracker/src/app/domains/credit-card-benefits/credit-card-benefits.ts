import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { BenefitsApi } from './data-access/benefits-api';
import { UserBenefitsStorage } from './data-access/user-benefits-storage';
import { BenefitsForm } from './ui/benefits-form/benefits-form';

@Component({
    selector: 'app-credit-card-benefits',
    imports: [BenefitsForm, CurrencyPipe],
    templateUrl: './credit-card-benefits.html',
    styleUrls: ['./credit-card-benefits.scss'],
})
export class CreditCardBenefits {
    private _benefitsApi = inject(BenefitsApi);
    private userBenefitsStorage = inject(UserBenefitsStorage);

    protected cardId = input<string>();

    protected get cardIdNum(): number | null {
        const id = this.cardId();
        return id ? +id : null;
    }

    protected benefitsRedeemedYTD = toSignal(
        this.userBenefitsStorage.getTotalBenefitsRedeemedYTD(),
        { initialValue: 0 },
    );

    protected creditCards = toSignal(this._benefitsApi.getCreditCards(), { initialValue: [] });
    protected creditCardName = computed(() => {
        const id = this.cardIdNum;
        if (!id) return null;
        const card = this.creditCards().find((c) => c.id === id);
        return card?.name ?? null;
    });

    protected creditCardBenefits = toSignal(
        toObservable(computed(() => this.cardIdNum)).pipe(
            switchMap((id) => (id !== null ? this._benefitsApi.getBenefitsForCard(id) : of(null))),
        ),
        { initialValue: null },
    );
}
