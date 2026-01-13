import { MonthlyBenefit } from './monthly-benefit';
import { YearlyBenefit } from './yearly-benefit';

export interface UserBenefits {
    year: string;
    yearly: YearlyBenefit[];
    monthly: MonthlyBenefit[];
}
