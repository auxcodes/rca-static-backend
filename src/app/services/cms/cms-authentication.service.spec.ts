import { TestBed } from '@angular/core/testing';

import { CmsAuthenticationService } from './cms-authentication.service';

describe('CmsAuthenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmsAuthenticationService = TestBed.get(CmsAuthenticationService);
    expect(service).toBeTruthy();
  });
});
