import { TestBed } from '@angular/core/testing';

import { ArtworkService } from './artwork.service';

describe('ArtworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArtworkService = TestBed.get(ArtworkService);
    expect(service).toBeTruthy();
  });
});
