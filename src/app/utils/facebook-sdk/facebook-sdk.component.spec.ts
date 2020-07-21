import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookSdkComponent } from './facebook-sdk.component';

describe('FacebookSdkComponent', () => {
  let component: FacebookSdkComponent;
  let fixture: ComponentFixture<FacebookSdkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookSdkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookSdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
