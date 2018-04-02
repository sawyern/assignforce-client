import { TestBed, inject } from '@angular/core/testing';

import { BuildingControllerService } from './building-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('BuildingControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuildingControllerService, HttpClient, HttpHandler]
    });
  });

  it(
    'should be created',
    inject([BuildingControllerService], (service: BuildingControllerService) => {
      expect(service).toBeTruthy();
    })
  );
});
