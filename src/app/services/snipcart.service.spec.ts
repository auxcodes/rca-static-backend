import { TestBed } from '@angular/core/testing';

import { SnipcartService } from './snipcart.service';

describe('SnipcartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SnipcartService = TestBed.get(SnipcartService);
    expect(service).toBeTruthy();
  });
});
