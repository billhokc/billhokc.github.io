import { BenefitUsage } from './benefit-usage';
import { MonthlyBenefit } from './monthly-benefit';

export interface UserBenefits {
    year: string;
    yearly: BenefitUsage[];
    monthly: MonthlyBenefit[];
}
