import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanktransferpopupComponent } from './banktransferpopup.component';

describe('BanktransferpopupComponent', () => {
  let component: BanktransferpopupComponent;
  let fixture: ComponentFixture<BanktransferpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BanktransferpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BanktransferpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
