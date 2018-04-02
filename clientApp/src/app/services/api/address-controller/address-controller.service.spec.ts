import { TestBed, inject } from '@angular/core/testing';

import { AddressControllerService } from './address-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('AddressControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddressControllerService, HttpClient, HttpHandler]
    });
  });

  it(
    'should be created',
    inject([AddressControllerService], (service: AddressControllerService) => {
      expect(service).toBeTruthy();
    })
  );
});
