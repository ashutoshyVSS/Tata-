import { TestBed } from '@angular/core/testing';

import { AppinterceptorService } from './appinterceptor.service';

describe('AppinterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppinterceptorService = TestBed.get(AppinterceptorService);
    expect(service).toBeTruthy();
  });
});
