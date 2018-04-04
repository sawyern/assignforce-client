import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { UnavailableControllerService } from './unavailable-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { trainers } from '../../../mockdb/mockdata/trainer.data';
import { Unavailability } from '../../../model/Unavailability';

describe('UnavailableControllerService', () => {
  let injector: TestBed;
  let service: UnavailableControllerService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnavailableControllerService, HttpClientTestingModule]
    });

    injector = getTestBed();
    service = injector.get(UnavailableControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<Unavailability> from createUnavailability',
      inject([UnavailableControllerService], (unavailable: UnavailableControllerService) => {
        const t = trainers;
        spyOn(unavailable, 'createUnavailability').and.returnValues(Observable.of(t));
        unavailable.createUnavailability(t[0].unavailabilities[0] as Unavailability).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].unavailabilities[0].id).toBe(317);
        });
      })
    );

    it(
      'should return an Observable<Unavailability> from retrieveUnavailability',
      inject([UnavailableControllerService], (unavailable: UnavailableControllerService) => {
        const t = trainers;
        spyOn(unavailable, 'retrieveUnavailability').and.returnValues(Observable.of(t));
        unavailable.retrieveUnavailability(317).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].unavailabilities[0].id).toBe(317);
        });
      })
    );

    it(
      'should return an Observable<Unavailability> from deleteUnavailability',
      inject([UnavailableControllerService], (unavailable: UnavailableControllerService) => {
        const t = trainers;
        spyOn(unavailable, 'deleteUnavailability').and.returnValues(Observable.of(t));
        unavailable.deleteUnavailability(317).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].unavailabilities[0].id).toBe(317);
        });
      })
    );

    it(
      'should return an Observable<Unavailability[]> from retrieveAllUnavailabilities',
      inject([UnavailableControllerService], (unavailable: UnavailableControllerService) => {
        const t = trainers;
        spyOn(unavailable, 'retrieveAllUnavailabilities').and.returnValues(Observable.of(t));
        unavailable.retrieveAllUnavailabilities().subscribe(result => {
          expect(result).toBeTruthy();
        });
      })
    );
  });
});
