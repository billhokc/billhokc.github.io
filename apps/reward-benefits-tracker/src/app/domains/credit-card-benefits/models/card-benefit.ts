import { BenefitProvider } from './benefit-provider';
import { CardBenefitFrequency } from './card-benefit-frequency';

export interface CardBenefit {
    id: number;
    provider: BenefitProvider;
    description: string;
    category: string;
    amount: number;
    frequency: CardBenefitFrequency;
    frequencyCount: number;
    splitByCalendarPeriod?: boolean | undefined;
}
