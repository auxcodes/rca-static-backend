import { TestBed } from '@angular/core/testing';

import { CmsFieldsService } from './cms-fields.service';

describe('CmsFieldsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmsFieldsService = TestBed.get(CmsFieldsService);
    expect(service).toBeTruthy();
  });
});
