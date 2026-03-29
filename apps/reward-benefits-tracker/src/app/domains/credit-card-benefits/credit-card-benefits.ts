import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GoogleAuthService } from '@billhokc/auth';
import { of, switchMap } from 'rxjs';
import { BenefitsApi } from './data-access/benefits-api';
import { UserBenefitsStorage } from './data-access/user-benefits-storage';
import { UserBenefits } from './models/user/user-benefits';
import { AnnualFeeProgress } from './ui/annual-fee-progress/annual-fee-progress';
import { BenefitsForm } from './ui/benefits-form/benefits-form';

@Component({
    selector: 'app-credit-card-benefits',
    imports: [BenefitsForm, AnnualFeeProgress, MatSnackBarModule],
    templateUrl: './credit-card-benefits.html',
    styleUrls: ['./credit-card-benefits.scss'],
})
export class CreditCardBenefits {
    private _benefitsApi = inject(BenefitsApi);
    private userBenefitsStorage = inject(UserBenefitsStorage);
    private _authService = inject(GoogleAuthService);
    private _snackbar = inject(MatSnackBar);

    protected cardId = input<string>();

    protected get cardIdNum(): number | null {
        const id = this.cardId();
        return id ? +id : null;
    }

    protected readonly user = toSignal(this._authService.user$);
    protected readonly isLoggedIn = computed(() => !!this.user());

    protected readonly savedBenefits = toSignal(
        this._authService.user$.pipe(
            switchMap((user) => user ? this.userBenefitsStorage.getData() : of(null)),
        ),
        { initialValue: null },
    );
    protected readonly benefitsRedeemedYTD = toSignal(
        this._authService.user$.pipe(
            switchMap((user) => user ? this.userBenefitsStorage.getTotalBenefitsRedeemedYTD() : of(0)),
        ),
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

    protected onSave(userBenefits: UserBenefits): void {
        this.userBenefitsStorage.saveData(userBenefits);
        this._snackbar.open('Saved', 'Close', { duration: 3000 });
    }
}
