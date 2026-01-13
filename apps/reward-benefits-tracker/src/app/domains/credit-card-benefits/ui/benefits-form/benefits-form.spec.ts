import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsForm } from './benefits-form';
import { UserBenefitsLocalStorage } from '../../data-access/user-benefits-local-storage';
import { UserBenefitsStorage } from '../../data-access/user-benefits-storage';

describe('BenefitsForm', () => {
  let component: BenefitsForm;
  let fixture: ComponentFixture<BenefitsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitsForm],
      providers: [{ provide: UserBenefitsStorage, useExisting: UserBenefitsLocalStorage }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenefitsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
