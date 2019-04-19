import { TestBed } from '@angular/core/testing';

import { CognitiveApiService } from './cognitive-api.service';

describe('CognitiveApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CognitiveApiService = TestBed.get(CognitiveApiService);
    expect(service).toBeTruthy();
  });
});
