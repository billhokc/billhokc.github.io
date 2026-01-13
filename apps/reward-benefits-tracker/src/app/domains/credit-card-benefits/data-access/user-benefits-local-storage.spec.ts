import { TestBed } from '@angular/core/testing';

import { UserBenefitsLocalStorage } from './user-benefits-local-storage.js';

describe('DataStoreLocal', () => {
    let service: UserBenefitsLocalStorage;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UserBenefitsLocalStorage);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
