import { TestBed } from '@angular/core/testing';

import { AsyncApiService } from './async-api.service';

describe('AsyncApiService', () => {
  let service: AsyncApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsyncApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
