import { TestBed } from '@angular/core/testing';

import { AboutPageService } from './about-page.service';

describe('AboutPageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AboutPageService = TestBed.get(AboutPageService);
    expect(service).toBeTruthy();
  });
});
