import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CreditCard } from '../../../shared/models/creditCard';
import { BenefitCategory } from '../models/benefit-category';
import { BenefitProvider } from '../models/benefit-provider';
import { CardBenefitFrequency } from '../models/card-benefit-frequency';
import { CardBenefits } from '../models/card-benefits';

@Injectable({
    providedIn: 'root',
})
export class BenefitsApi {
    benefitProviders: BenefitProvider[] = [
        { id: 1, name: 'Door Dash' },
        { id: 2, name: 'Lyft' },
        { id: 3, name: 'StubHub' },
        { id: 4, name: 'OpenTable' },
        { id: 5, name: 'IHG' },
        { id: 6, name: 'The Edit' },
        { id: 7, name: 'Chase' },
        { id: 8, name: 'Apple TV' },
    ];

    private providersByName = new Map(this.benefitProviders.map((p) => [p.name, p]));

    private getProvider(name: string): BenefitProvider {
        return this.providersByName.get(name)!;
    }

    getCreditCards(): Observable<CreditCard[]> {
        return of([
            { id: 1, name: 'Chase Sapphire Reserve' },
            { id: 2, name: 'Chase Sapphire Preferred' },
        ]);
    }

    getBenefitsForCard(cardId: number): Observable<CardBenefits | null> {
        let benefits: CardBenefits | null = null;

        if (cardId === 1) {
            benefits = {
                annualFee: 795,
                benefits: [
                    {
                        id: 1,
                        provider: this.getProvider('Door Dash'),
                        description: 'Groceries',
                        category: BenefitCategory.Shopping,
                        amount: 10,
                        frequency: CardBenefitFrequency.Monthly,
                        frequencyCount: 2,
                        vendorMarkup: 0.4,
                    },
                    {
                        id: 2,
                        provider: this.getProvider('Door Dash'),
                        description: 'Restaurants',
                        category: BenefitCategory.Dining,
                        amount: 5,
                        frequency: CardBenefitFrequency.Monthly,
                        frequencyCount: 1,
                        vendorMarkup: null
                    },
                    {
                        id: 3,
                        provider: this.getProvider('Lyft'),
                        description: 'Rides',
                        category: BenefitCategory.Travel,
                        amount: 10,
                        frequency: CardBenefitFrequency.Monthly,
                        frequencyCount: 1,
                        vendorMarkup: null
                    },
                    {
                        id: 4,
                        provider: this.getProvider('StubHub'),
                        description: 'Tickets',
                        category: BenefitCategory.Entertainment,
                        amount: 150,
                        frequency: CardBenefitFrequency.Yearly,
                        frequencyCount: 2,
                        splitByCalendarPeriod: true,
                        vendorMarkup: null
                    },
                    {
                        id: 5,
                        provider: this.getProvider('OpenTable'),
                        description: 'Restaurants',
                        category: BenefitCategory.Dining,
                        amount: 150,
                        frequency: CardBenefitFrequency.Yearly,
                        frequencyCount: 2,
                        splitByCalendarPeriod: true,
                        vendorMarkup: null
                    },
                    {
                        id: 6,
                        provider: this.getProvider('IHG'),
                        description: 'Hotels',
                        category: BenefitCategory.Travel,
                        amount: 250,
                        frequency: CardBenefitFrequency.Yearly,
                        frequencyCount: 1,
                        vendorMarkup: null
                    },
                    {
                        id: 7,
                        provider: this.getProvider('The Edit'),
                        description: 'Hotels',
                        category: BenefitCategory.Travel,
                        amount: 250,
                        frequency: CardBenefitFrequency.Yearly,
                        frequencyCount: 2,
                        splitByCalendarPeriod: false,
                        vendorMarkup: null
                    },
                    {
                        id: 8,
                        provider: this.getProvider('Chase'),
                        description: 'Travel Credits',
                        category: BenefitCategory.Travel,
                        amount: 300,
                        frequency: CardBenefitFrequency.Yearly,
                        frequencyCount: 1,
                        vendorMarkup: null
                    },
                    {
                        id: 9,
                        provider: this.getProvider('Apple TV'),
                        description: 'Subscriptions',
                        category: BenefitCategory.Entertainment,
                        amount: 156,
                        frequency: CardBenefitFrequency.Yearly,
                        frequencyCount: 1,
                        vendorMarkup: null
                    },
                ],
            };
        }

        return of(benefits);
    }
}
