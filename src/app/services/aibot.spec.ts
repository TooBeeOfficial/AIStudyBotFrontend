import { TestBed } from '@angular/core/testing';

import { AIBot } from './aibot';

describe('AIBot', () => {
  let service: AIBot;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AIBot);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
