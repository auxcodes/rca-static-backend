import { TestBed } from '@angular/core/testing';

import { CmsImageService } from './cms-image.service';

describe('CmsImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmsImageService = TestBed.get(CmsImageService);
    expect(service).toBeTruthy();
  });
});
