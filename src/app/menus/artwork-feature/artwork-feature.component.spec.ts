import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkFeatureComponent } from './artwork-feature.component';

describe('ArtworkFeatureComponent', () => {
  let component: ArtworkFeatureComponent;
  let fixture: ComponentFixture<ArtworkFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtworkFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworkFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
