import { TestBed } from '@angular/core/testing';

import { TermsConditionsService } from './terms-conditions.service';

describe('TermsConditionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TermsConditionsService = TestBed.get(TermsConditionsService);
    expect(service).toBeTruthy();
  });
});
