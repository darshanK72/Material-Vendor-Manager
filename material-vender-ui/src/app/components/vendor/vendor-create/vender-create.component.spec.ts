import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderCreateComponent } from './vender-create.component';

describe('VenderCreateComponent', () => {
  let component: VenderCreateComponent;
  let fixture: ComponentFixture<VenderCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VenderCreateComponent]
    });
    fixture = TestBed.createComponent(VenderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
