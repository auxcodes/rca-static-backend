import { TestBed } from '@angular/core/testing';

import { ArtworkCarouselService } from './artwork-carousel.service';

describe('ArtworkCarouselService', () => {
  let service: ArtworkCarouselService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtworkCarouselService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
