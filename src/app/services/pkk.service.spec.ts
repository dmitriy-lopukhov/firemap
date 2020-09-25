import { TestBed } from '@angular/core/testing';

import { PkkService } from './pkk.service';

describe('PkkService', () => {
  let service: PkkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PkkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
