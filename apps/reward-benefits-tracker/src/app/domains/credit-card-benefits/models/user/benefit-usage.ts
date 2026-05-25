export interface BenefitUsage {
    providerId: number;
    benefitId: number;
    amounts: number[];
    vendorMarkup?: number;
    createdDate: string;
    modifiedDate: string;
}
