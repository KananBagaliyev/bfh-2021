import { TestBed } from '@angular/core/testing';

import { AuthNotSellerGuard } from './auth-not-seller.guard';

describe('AuthNotSellerGuard', () => {
  let guard: AuthNotSellerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthNotSellerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
