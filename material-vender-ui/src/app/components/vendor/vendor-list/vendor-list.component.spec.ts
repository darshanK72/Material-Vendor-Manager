import { ComponentFixture, TestBed } from '@angular/core/testing';

import { vendorListComponent } from './vendor-list.component';

describe('vendorListComponent', () => {
  let component: vendorListComponent;
  let fixture: ComponentFixture<vendorListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [vendorListComponent]
    });
    fixture = TestBed.createComponent(vendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
