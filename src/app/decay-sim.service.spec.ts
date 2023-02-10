import { TestBed } from '@angular/core/testing';

import { DecaySimService } from './decay-sim.service';

describe('DecaySimService', () => {
  let service: DecaySimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecaySimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
