import { CurrencyPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-annual-fee-progress',
    imports: [MatProgressBarModule, CurrencyPipe],
    templateUrl: './annual-fee-progress.html',
    styleUrls: ['./annual-fee-progress.scss'],
})
export class AnnualFeeProgress {
    annualFee = input<number>(0);
    benefitsRedeemedYTD = input<number>(0);

    protected progressValue = computed(() => {
        const fee = this.annualFee();
        if (!fee) return 0;
        return Math.min((this.benefitsRedeemedYTD() / fee) * 100, 100);
    });
}
