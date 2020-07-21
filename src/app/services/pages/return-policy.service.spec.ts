import { TestBed } from '@angular/core/testing';

import { ReturnPolicyService } from './return-policy.service';

describe('ReturnPolicyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReturnPolicyService = TestBed.get(ReturnPolicyService);
    expect(service).toBeTruthy();
  });
});
