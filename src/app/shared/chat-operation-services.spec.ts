import { TestBed } from '@angular/core/testing';

import { ChatOperationServices } from './chat-operation-services';

describe('ChatOperationServices', () => {
  let service: ChatOperationServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatOperationServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
