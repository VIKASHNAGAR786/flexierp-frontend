import { TestBed } from '@angular/core/testing';

import { UserinfowithloginService } from './userinfowithlogin.service';

describe('UserinfowithloginService', () => {
  let service: UserinfowithloginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserinfowithloginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
