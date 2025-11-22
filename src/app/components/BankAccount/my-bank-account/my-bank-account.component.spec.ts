import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBankAccountComponent } from './my-bank-account.component';

describe('MyBankAccountComponent', () => {
  let component: MyBankAccountComponent;
  let fixture: ComponentFixture<MyBankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBankAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
