import { TestBed } from '@angular/core/testing';

import { CmsCollectionsService } from './cms-collections.service';

describe('CmsCollectionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmsCollectionsService = TestBed.get(CmsCollectionsService);
    expect(service).toBeTruthy();
  });
});
