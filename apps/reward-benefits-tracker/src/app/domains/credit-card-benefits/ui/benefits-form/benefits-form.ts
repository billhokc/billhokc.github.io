import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UserBenefitsStorage } from '../../data-access/user-benefits-storage';
import { CardBenefitFrequency } from '../../models/card-benefit-frequency';
import { CardBenefits } from '../../models/card-benefits';
import { Tab } from '../../models/tab';
import { MonthlyAmountUsed } from '../../models/user/monthly-amount-used';
import { MonthlyBenefit } from '../../models/user/monthly-benefit';
import { UserBenefits } from '../../models/user/user-benefits';
import { YearlyBenefit } from '../../models/user/yearly-benefit';

@Component({
    selector: 'app-benefits-form',
    imports: [
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        ReactiveFormsModule,
        CurrencyPipe,
        MatSnackBarModule,
    ],
    templateUrl: './benefits-form.html',
    styleUrls: ['./benefits-form.scss'],
})
export class BenefitsForm {
    formBuilder = inject(FormBuilder);
    private storage = inject(UserBenefitsStorage);
    private _snackbar = inject(MatSnackBar);

    private readonly savedBenefits = toSignal(this.storage.getData(), { initialValue: null });

    benefits = input<CardBenefits | null>();

    protected monthTabs: Tab[] = [];
    protected selectedMonthTab = 0;
    protected yearlyBenefits = computed(() => {
        return (
            this.benefits()?.benefits.filter((b) => b.frequency === CardBenefitFrequency.Yearly) ||
            []
        );
    });
    protected monthlyBenefits = computed(() => {
        return (
            this.benefits()?.benefits.filter((b) => b.frequency === CardBenefitFrequency.Monthly) ||
            []
        );
    });

    private readonly monthsInYear = 12;
    protected benefitsForm = linkedSignal({
        source: () => [this.yearlyBenefits(), this.monthlyBenefits()] as const,
        computation: ([yearlyBenefits, monthlyBenefits]) => {
            const yearlyGroup = this.formBuilder.group(
                Object.fromEntries(
                    yearlyBenefits.map((benefit) => [
                        benefit.id,
                        this.formBuilder.group({
                            amountInputs: this.formBuilder.array(
                                Array(benefit.frequencyCount ?? 1)
                                    .fill(null)
                                    .map(() => this.createAmountInputControl(benefit.amount)),
                            ),
                        }),
                    ]),
                ),
            );

            const monthlyArray = this.formBuilder.array(
                Array.from({ length: this.monthsInYear }, () =>
                    this.formBuilder.group(
                        Object.fromEntries(
                            monthlyBenefits.map((benefit) => [
                                benefit.id,
                                this.formBuilder.group({
                                    amountInputs: this.formBuilder.array(
                                        Array(benefit.frequencyCount ?? 1)
                                            .fill(null)
                                            .map(() =>
                                                this.createAmountInputControl(benefit.amount),
                                            ),
                                    ),
                                }),
                            ]),
                        ),
                    ),
                ),
            );

            return this.formBuilder.group({
                yearlyBenefits: yearlyGroup,
                monthlyBenefits: monthlyArray,
            });
        },
    });

    constructor() {
        this.monthTabs = this.buildMonthTabs();
        this.selectedMonthTab = new Date().getMonth(); // Default to current month

        effect((onCleanup) => {
            const form = this.benefitsForm();
            const subscription = form.valueChanges
                .pipe(
                    debounceTime(500), // Wait 500ms after last keystroke
                    distinctUntilChanged(), // Only save if values actually changed
                )
                .subscribe(() => {
                    if (form.invalid) {
                        return;
                    }

                    this.saveToLocalStorage();
                    this._snackbar.open('Saved', 'Close', { duration: 3000 });
                });

            onCleanup(() => {
                subscription.unsubscribe();
            });
        });

        effect(() => {
            const form = this.benefitsForm();
            const benefits = this.benefits();
            const savedBenefits = this.savedBenefits();

            if (!benefits || !savedBenefits) {
                return;
            }

            this.patchFormFromLocalStorage(form, savedBenefits);
        });
    }

    private buildMonthTabs(): Tab[] {
        const tabs = new Array(this.monthsInYear).fill(0).map((_, i) => {
            // Create a date object for the first day of each month (month index 0-11)
            // We use day 1 to avoid issues with months having fewer than 31 days
            const date = new Date(Date.UTC(2000, i + 1, 1));

            // Use toLocaleDateString to get the full month name in the default locale
            const month = date.toLocaleDateString(undefined, { month: 'short' });

            return {
                title: month,
                value: i,
            };
        });

        return tabs;
    }

    protected createArray(length: number): any[] {
        return Array(length).fill(null);
    }

    private createAmountInputControl(maxAmount: number): FormControl {
        return this.formBuilder.control('', {
            validators: [Validators.min(0), Validators.max(maxAmount)],
        });
    }

    protected getYearlyAmountInputControl(
        benefitId: string | number,
        index: number,
    ): FormControl | null {
        const yearlyBenefits = (this.benefitsForm().get('yearlyBenefits') as FormGroup)
            .get(benefitId.toString())
            ?.get('amountInputs') as FormArray;

        return yearlyBenefits ? (yearlyBenefits.at(index) as FormControl) : null;
    }

    protected getMonthlyAmountInputControl(
        monthIndex: string | number,
        benefitId: string | number,
        index: number,
    ): FormControl | null {
        const monthlyBenefits = (this.benefitsForm().get('monthlyBenefits') as FormArray)
            .get(monthIndex.toString())
            ?.get(benefitId.toString())
            ?.get('amountInputs') as FormArray;

        return monthlyBenefits ? (monthlyBenefits.at(index) as FormControl) : null;
    }

    private saveToLocalStorage(): void {
        const formValue = this.benefitsForm().getRawValue();
        const currentYear = new Date().getFullYear().toString();
        const now = new Date().toISOString();

        const userBenefits: UserBenefits = {
            year: currentYear,
            yearly: this.transformYearlyBenefits(formValue.yearlyBenefits, now),
            monthly: this.transformMonthlyBenefits(formValue.monthlyBenefits, now),
        };

        this.storage.saveData(userBenefits);
    }

    private transformYearlyBenefits(yearlyData: any, timestamp: string): YearlyBenefit[] {
        const yearlyBenefits = this.yearlyBenefits();
        const results: YearlyBenefit[] = [];

        for (const benefit of yearlyBenefits) {
            const benefitData = yearlyData[benefit.id];
            if (benefitData?.amountInputs) {
                results.push({
                    providerId: benefit.provider.id,
                    benefitId: benefit.id,
                    amounts: benefitData.amountInputs.map((value: any) => parseFloat(value) || 0),
                    createdDate: timestamp,
                    modifiedDate: timestamp,
                });
            }
        }

        return results;
    }

    private transformMonthlyBenefits(monthlyData: any[], timestamp: string): MonthlyBenefit[] {
        const monthlyBenefits = this.monthlyBenefits();
        const results: MonthlyBenefit[] = [];

        monthlyData.forEach((monthData, monthIndex) => {
            const amountUsedForMonth: MonthlyAmountUsed[] = [];

            for (const benefit of monthlyBenefits) {
                const benefitData = monthData[benefit.id];
                if (benefitData?.amountInputs) {
                    amountUsedForMonth.push({
                        providerId: benefit.provider.id,
                        benefitId: benefit.id,
                        amounts: benefitData.amountInputs.map(
                            (value: any) => parseFloat(value) || 0,
                        ),
                        createdDate: timestamp,
                        modifiedDate: timestamp,
                    });
                }
            }

            // Convert month index (0-11) to month name (Jan, Feb, etc.)
            const monthName = new Date(2000, monthIndex, 1).toLocaleDateString(undefined, {
                month: 'short',
            });

            results.push({
                month: monthName,
                amountUsed: amountUsedForMonth,
            });
        });

        return results;
    }

    private patchFormFromLocalStorage(form: FormGroup, savedBenefits: UserBenefits): void {
        const yearlyForm = form.get('yearlyBenefits') as FormGroup;
        const monthlyForm = form.get('monthlyBenefits') as FormArray;

        for (const savedYearlyBenefit of savedBenefits.yearly) {
            const amountInputs = yearlyForm
                .get(savedYearlyBenefit.benefitId.toString())
                ?.get('amountInputs') as FormArray | null;

            if (!amountInputs) {
                continue;
            }

            this.patchAmountInputs(amountInputs, savedYearlyBenefit.amounts);
        }

        for (const savedMonthlyBenefit of savedBenefits.monthly) {
            const monthIndex = this.monthTabs.findIndex(
                (tab) => tab.title.toLowerCase() === savedMonthlyBenefit.month.toLowerCase(),
            );

            if (monthIndex < 0) {
                continue;
            }

            const monthGroup = monthlyForm.at(monthIndex) as FormGroup;

            for (const savedAmountUsed of savedMonthlyBenefit.amountUsed) {
                const amountInputs = monthGroup
                    .get(savedAmountUsed.benefitId.toString())
                    ?.get('amountInputs') as FormArray | null;

                if (!amountInputs) {
                    continue;
                }

                this.patchAmountInputs(amountInputs, savedAmountUsed.amounts);
            }
        }
    }

    private patchAmountInputs(amountInputs: FormArray, amounts: number[]): void {
        for (let index = 0; index < amountInputs.length; index++) {
            const amount = amounts[index];
            amountInputs.at(index).setValue(amount ?? '', { emitEvent: false });
        }
    }
}
