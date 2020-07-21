import { TestBed } from '@angular/core/testing';

import { CmsClientService } from './cms-client.service';

describe('CmsClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmsClientService = TestBed.get(CmsClientService);
    expect(service).toBeTruthy();
  });
});
