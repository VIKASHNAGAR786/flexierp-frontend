import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldCustomerPopupComponent } from './old-customer-popup.component';

describe('OldCustomerPopupComponent', () => {
  let component: OldCustomerPopupComponent;
  let fixture: ComponentFixture<OldCustomerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OldCustomerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OldCustomerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
