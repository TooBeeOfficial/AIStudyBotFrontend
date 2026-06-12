import { TestBed } from '@angular/core/testing';

import { RouteServices } from './route-services';

describe('RouteServices', () => {
  let service: RouteServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
