import { TestBed } from '@angular/core/testing';

import { HeatService } from './heat.service';

describe('HeatService', () => {
  let service: HeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
