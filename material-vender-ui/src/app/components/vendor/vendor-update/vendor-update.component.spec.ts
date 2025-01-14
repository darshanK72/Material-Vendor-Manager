import { ComponentFixture, TestBed } from '@angular/core/testing';

import { vendorUpdateComponent } from './vendor-update.component';

describe('vendorUpdateComponent', () => {
  let component: vendorUpdateComponent;
  let fixture: ComponentFixture<vendorUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [vendorUpdateComponent]
    });
    fixture = TestBed.createComponent(vendorUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
