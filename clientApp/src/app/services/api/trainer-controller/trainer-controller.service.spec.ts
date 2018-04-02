import { TestBed, inject } from '@angular/core/testing';

import { TrainerControllerService } from './trainer-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('TrainerControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainerControllerService, HttpClient, HttpHandler]
    });
  });

  it(
    'should be created',
    inject([TrainerControllerService], (service: TrainerControllerService) => {
      expect(service).toBeTruthy();
    })
  );
});
