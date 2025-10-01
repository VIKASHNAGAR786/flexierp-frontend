import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersStatementReportComponent } from './customers-statement-report.component';

describe('CustomersStatementReportComponent', () => {
  let component: CustomersStatementReportComponent;
  let fixture: ComponentFixture<CustomersStatementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersStatementReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersStatementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
