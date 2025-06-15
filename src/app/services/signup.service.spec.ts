import { TestBed } from '@angular/core/testing';

import { FarmerService } from './signup.service';

describe('SignupService', () => {
  let service: FarmerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FarmerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
