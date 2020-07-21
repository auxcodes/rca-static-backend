import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtworkSpinnerComponent } from './artwork-spinner.component';

describe('ArtworkSpinnerComponent', () => {
  let component: ArtworkSpinnerComponent;
  let fixture: ComponentFixture<ArtworkSpinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtworkSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtworkSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
