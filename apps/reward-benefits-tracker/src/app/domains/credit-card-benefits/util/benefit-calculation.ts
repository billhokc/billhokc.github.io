import { CardBenefits } from "../models/card-benefits";
import { UserBenefits } from "../models/user/user-benefits";

/**
 * When `cardBenefits` is provided its `vendorMarkup` values take priority over
 * any markup stored in `UserBenefits`. Pass it from the component to ensure the
 * display always reflects the current API definition, not stale stored values.
 */
export function computeTotalBenefitsRedeemedYTD(
    data: UserBenefits | null,
    cardBenefits?: CardBenefits | null,
): number {
    const markupMap = cardBenefits
        ? new Map(cardBenefits.benefits.map((b) => [b.id, b.vendorMarkup ?? 0]))
        : null;

    const effectiveValue = (benefitId: number, storedMarkup: number | null, amount: number) => {
        const markup = markupMap ? (markupMap.get(benefitId) ?? 0) : (storedMarkup ?? 0);
        return amount * (1 - markup);
    };

    const yearlyTotal =
        data?.yearly.reduce(
            (total, benefit) =>
                total +
                benefit.amounts.reduce(
                    (sum, a) => sum + effectiveValue(benefit.benefitId, benefit.vendorMarkup, a),
                    0,
                ),
            0,
        ) ?? 0;
    const monthlyTotal =
        data?.monthly.reduce(
            (total, month) =>
                total +
                month.amountUsed.reduce(
                    (sum, usage) =>
                        sum +
                        usage.amounts.reduce(
                            (s, a) => s + effectiveValue(usage.benefitId, usage.vendorMarkup, a),
                            0,
                        ),
                    0,
                ),
            0,
        ) ?? 0;
    return yearlyTotal + monthlyTotal;
}