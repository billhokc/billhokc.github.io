import { MonthlyAmountUsed } from './monthly-amount-used';

export interface MonthlyBenefit {
  month: string;
  amountUsed: MonthlyAmountUsed[];
}
