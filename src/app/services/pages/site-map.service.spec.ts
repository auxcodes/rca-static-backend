import { TestBed } from '@angular/core/testing';

import { SiteMapService } from './site-map.service';

describe('SiteMapService', () => {
  let service: SiteMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
