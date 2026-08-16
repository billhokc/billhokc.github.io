export interface BenefitUsage {
    providerId: number;
    benefitId: number;
    amounts: number[];
    vendorMarkup: number | null;
    createdDate: string;
    modifiedDate: string;
}
