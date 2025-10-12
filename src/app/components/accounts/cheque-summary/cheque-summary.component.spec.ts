import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequeSummaryComponent } from './cheque-summary.component';

describe('ChequeSummaryComponent', () => {
  let component: ChequeSummaryComponent;
  let fixture: ComponentFixture<ChequeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChequeSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChequeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
