import { TestBed } from '@angular/core/testing';

import { SharedMatarialsService } from './shared-matarials.service';

describe('SharedMatarialsService', () => {
  let service: SharedMatarialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedMatarialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
