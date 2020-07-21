import { TestBed } from '@angular/core/testing';

import { SiteLinksService } from './site-links.service';

describe('SiteLinksService', () => {
  let service: SiteLinksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SiteLinksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
