import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardBenefits } from './credit-card-benefits';
import { UserBenefitsLocalStorage } from './data-access/user-benefits-local-storage';
import { UserBenefitsStorage } from './data-access/user-benefits-storage';

describe('ChaseReserve', () => {
    let component: CreditCardBenefits;
    let fixture: ComponentFixture<CreditCardBenefits>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CreditCardBenefits],
            providers: [{ provide: UserBenefitsStorage, useExisting: UserBenefitsLocalStorage }],
        }).compileComponents();

        fixture = TestBed.createComponent(CreditCardBenefits);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
