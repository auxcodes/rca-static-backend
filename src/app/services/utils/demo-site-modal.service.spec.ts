import { TestBed } from '@angular/core/testing';

import { DemoSiteModalService } from './demo-site-modal.service';

describe('DemoSiteModalService', () => {
  let service: DemoSiteModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoSiteModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
