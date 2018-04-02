import { TestBed, inject } from '@angular/core/testing';

import { UnavailableControllerService } from './unavailable-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('UnavailableControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnavailableControllerService, HttpClient, HttpHandler]
    });
  });

  it(
    'should be created',
    inject([UnavailableControllerService], (service: UnavailableControllerService) => {
      expect(service).toBeTruthy();
    })
  );
});
