import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreateComponent } from './vendor-create.component';

describe('VendorCreateComponent', () => {
  let component: VendorCreateComponent;
  let fixture: ComponentFixture<VendorCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorCreateComponent]
    });
    fixture = TestBed.createComponent(VendorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
