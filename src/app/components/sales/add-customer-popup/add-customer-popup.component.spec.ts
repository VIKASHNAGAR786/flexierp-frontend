import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerPopupComponent } from './add-customer-popup.component';

describe('AddCustomerPopupComponent', () => {
  let component: AddCustomerPopupComponent;
  let fixture: ComponentFixture<AddCustomerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCustomerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
