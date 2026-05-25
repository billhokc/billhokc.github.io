import { UserBenefits } from '../models/user/user-benefits';
import { computeTotalBenefitsRedeemedYTD } from './user-benefits-storage';

// NOTE: If redeemed totals appear unchanged after adding vendorMarkup support,
// the cause is stale data in localStorage that was saved before vendorMarkup was
// persisted. Triggering any form save will re-persist the vendorMarkup and fix it.

const TIMESTAMP = '2026-01-01T00:00:00.000Z';

describe('computeTotalBenefitsRedeemedYTD', () => {
    describe('null / empty data', () => {
        it('returns 0 for null', () => {
            expect(computeTotalBenefitsRedeemedYTD(null)).toBe(0);
        });

        it('returns 0 when yearly and monthly are empty', () => {
            const data: UserBenefits = { year: '2026', yearly: [], monthly: [] };
            expect(computeTotalBenefitsRedeemedYTD(data)).toBe(0);
        });
    });

    describe('yearly benefits', () => {
        it('sums amounts with no markup applied when vendorMarkup is absent', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [
                    {
                        providerId: 1,
                        benefitId: 1,
                        amounts: [100, 50],
                        createdDate: TIMESTAMP,
                        modifiedDate: TIMESTAMP,
                    },
                ],
                monthly: [],
            };
            expect(computeTotalBenefitsRedeemedYTD(data)).toBe(150);
        });

        it('applies vendorMarkup to reduce the effective value', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [
                    {
                        providerId: 1,
                        benefitId: 1,
                        amounts: [100],
                        vendorMarkup: 0.4,
                        createdDate: TIMESTAMP,
                        modifiedDate: TIMESTAMP,
                    },
                ],
                monthly: [],
            };
            // $100 with 40% vendor markup → effective value is $60
            expect(computeTotalBenefitsRedeemedYTD(data)).toBeCloseTo(60);
        });

        it('applies vendorMarkup to each amount independently', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [
                    {
                        providerId: 1,
                        benefitId: 1,
                        amounts: [100, 50],
                        vendorMarkup: 0.4,
                        createdDate: TIMESTAMP,
                        modifiedDate: TIMESTAMP,
                    },
                ],
                monthly: [],
            };
            // (100 + 50) * 0.6 = 90
            expect(computeTotalBenefitsRedeemedYTD(data)).toBeCloseTo(90);
        });

        it('treats explicit vendorMarkup of 0 the same as no markup', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [
                    {
                        providerId: 1,
                        benefitId: 1,
                        amounts: [200],
                        vendorMarkup: 0,
                        createdDate: TIMESTAMP,
                        modifiedDate: TIMESTAMP,
                    },
                ],
                monthly: [],
            };
            expect(computeTotalBenefitsRedeemedYTD(data)).toBe(200);
        });

        it('sums across multiple yearly benefits with different markups', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [
                    {
                        providerId: 1,
                        benefitId: 1,
                        amounts: [100],
                        vendorMarkup: 0.4, // effective: 60
                        createdDate: TIMESTAMP,
                        modifiedDate: TIMESTAMP,
                    },
                    {
                        providerId: 2,
                        benefitId: 2,
                        amounts: [200],
                        // no markup → effective: 200
                        createdDate: TIMESTAMP,
                        modifiedDate: TIMESTAMP,
                    },
                ],
                monthly: [],
            };
            expect(computeTotalBenefitsRedeemedYTD(data)).toBeCloseTo(260);
        });
    });

    describe('monthly benefits', () => {
        it('sums amounts with no markup across months', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [],
                monthly: [
                    {
                        month: 'Jan',
                        amountUsed: [
                            {
                                providerId: 1,
                                benefitId: 1,
                                amounts: [10, 10],
                                createdDate: TIMESTAMP,
                                modifiedDate: TIMESTAMP,
                            },
                        ],
                    },
                    {
                        month: 'Feb',
                        amountUsed: [
                            {
                                providerId: 1,
                                benefitId: 1,
                                amounts: [10, 0],
                                createdDate: TIMESTAMP,
                                modifiedDate: TIMESTAMP,
                            },
                        ],
                    },
                ],
            };
            expect(computeTotalBenefitsRedeemedYTD(data)).toBe(30);
        });

        it('applies vendorMarkup to monthly amounts', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [],
                monthly: [
                    {
                        month: 'Jan',
                        amountUsed: [
                            {
                                providerId: 1,
                                benefitId: 1,
                                amounts: [10, 10],
                                vendorMarkup: 0.4,
                                createdDate: TIMESTAMP,
                                modifiedDate: TIMESTAMP,
                            },
                        ],
                    },
                ],
            };
            // (10 + 10) * 0.6 = 12
            expect(computeTotalBenefitsRedeemedYTD(data)).toBeCloseTo(12);
        });

        it('handles a month with no amounts redeemed', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [],
                monthly: [
                    {
                        month: 'Jan',
                        amountUsed: [
                            {
                                providerId: 1,
                                benefitId: 1,
                                amounts: [0, 0],
                                vendorMarkup: 0.4,
                                createdDate: TIMESTAMP,
                                modifiedDate: TIMESTAMP,
                            },
                        ],
                    },
                ],
            };
            expect(computeTotalBenefitsRedeemedYTD(data)).toBe(0);
        });
    });

    describe('combined yearly and monthly', () => {
        it('sums yearly and monthly totals together applying respective markups', () => {
            const data: UserBenefits = {
                year: '2026',
                yearly: [
                    {
                        providerId: 2,
                        benefitId: 4,
                        amounts: [150],
                        vendorMarkup: 0.4, // effective: 90
                        createdDate: TIMESTAMP,
                        modifiedDate: TIMESTAMP,
                    },
                ],
                monthly: [
                    {
                        month: 'Jan',
                        amountUsed: [
                            {
                                providerId: 1,
                                benefitId: 1,
                                amounts: [10, 10],
                                vendorMarkup: 0.4, // effective: 12
                                createdDate: TIMESTAMP,
                                modifiedDate: TIMESTAMP,
                            },
                            {
                                providerId: 1,
                                benefitId: 2,
                                amounts: [5],
                                // no markup → effective: 5
                                createdDate: TIMESTAMP,
                                modifiedDate: TIMESTAMP,
                            },
                        ],
                    },
                ],
            };
            // 90 + 12 + 5 = 107
            expect(computeTotalBenefitsRedeemedYTD(data)).toBeCloseTo(107);
        });
    });
});
