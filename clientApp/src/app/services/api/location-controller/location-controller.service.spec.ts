import { TestBed, inject } from '@angular/core/testing';

import { LocationControllerService } from './location-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('LocationControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocationControllerService, HttpClient, HttpHandler]
    });
  });

  it(
    'should be created',
    inject([LocationControllerService], (service: LocationControllerService) => {
      expect(service).toBeTruthy();
    })
  );
});
