import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductlistpopupComponent } from './productlistpopup.component';

describe('ProductlistpopupComponent', () => {
  let component: ProductlistpopupComponent;
  let fixture: ComponentFixture<ProductlistpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductlistpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductlistpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
