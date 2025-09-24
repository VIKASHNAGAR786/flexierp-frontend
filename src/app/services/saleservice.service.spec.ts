import { TestBed } from '@angular/core/testing';

import { SaleserviceService } from './saleservice.service';

describe('SaleserviceService', () => {
  let service: SaleserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SaleserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
