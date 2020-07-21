import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerHtmlComponent } from './inner-html.component';

describe('InnerHtmlComponent', () => {
  let component: InnerHtmlComponent;
  let fixture: ComponentFixture<InnerHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnerHtmlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnerHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
