import { TestBed } from '@angular/core/testing';

import { ApiTokensService } from './api-tokens.service';

describe('ApiTokensService', () => {
  let service: ApiTokensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTokensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
