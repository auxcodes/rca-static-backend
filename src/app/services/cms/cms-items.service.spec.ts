import { TestBed } from '@angular/core/testing';

import { CmsItemsService } from './cms-items.service';

describe('CmsItemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmsItemsService = TestBed.get(CmsItemsService);
    expect(service).toBeTruthy();
  });
});
