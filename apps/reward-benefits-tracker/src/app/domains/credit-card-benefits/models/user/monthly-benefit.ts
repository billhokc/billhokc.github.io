import { BenefitUsage } from './benefit-usage';

export interface MonthlyBenefit {
    month: string;
    amountUsed: BenefitUsage[];
}
