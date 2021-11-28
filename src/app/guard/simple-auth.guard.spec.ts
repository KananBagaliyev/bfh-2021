import { TestBed } from '@angular/core/testing';

import { SimpleAuthGuard } from './simple-auth.guard';

describe('SimpleAuthGuard', () => {
  let guard: SimpleAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SimpleAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
