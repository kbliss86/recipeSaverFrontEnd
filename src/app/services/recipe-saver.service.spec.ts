import { TestBed } from '@angular/core/testing';

import { RecipeSaverService } from './recipe-saver.service';

describe('RecipeSaverService', () => {
  let service: RecipeSaverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeSaverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
