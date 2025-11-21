import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequePopupComponent } from './cheque-popup.component';

describe('ChequePopupComponent', () => {
  let component: ChequePopupComponent;
  let fixture: ComponentFixture<ChequePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequePopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
