import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { LocationControllerService } from './location-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { batches } from '../../../mockdb/mockdata/batch.data';

describe('LocationControllerService', () => {
  let injector: TestBed;
  let service: LocationControllerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationControllerService, HttpClientTestingModule]
    });

    injector = getTestBed();
    service = injector.get(LocationControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<BatchLocation> from createLocation',
      inject([LocationControllerService], (loc: LocationControllerService) => {
        const b = batches;
        spyOn(loc, 'createLocation').and.returnValues(Observable.of(b));
        loc.createLocation(b[0].batchLocation).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].batchLocation.id).toBe(22);
        });
      })
    );

    it(
      'should return an Observable<BatchLocation> from updateLocation',
      inject([LocationControllerService], (loc: LocationControllerService) => {
        const b = batches;
        spyOn(loc, 'updateLocation').and.returnValues(Observable.of(b));
        loc.updateLocation(b[0].batchLocation).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].batchLocation.id).toBe(22);
        });
      })
    );

    it(
      'should return an Observable<BatchLocation> from retrieveLocation',
      inject([LocationControllerService], (loc: LocationControllerService) => {
        const b = batches;
        spyOn(loc, 'retrieveLocation').and.returnValues(Observable.of(b));
        loc.retrieveLocation(22).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].batchLocation.id).toBe(22);
        });
      })
    );

    it(
      'should return an Observable<BatchLocation> from deleteLocation',
      inject([LocationControllerService], (loc: LocationControllerService) => {
        const b = batches;
        spyOn(loc, 'deleteLocation').and.returnValues(Observable.of(b));
        loc.deleteLocation(22).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].batchLocation.id).toBe(22);
        });
      })
    );

    it(
      'should return an Observable<BatchLocation> from retrieveAllLocation',
      inject([LocationControllerService], (loc: LocationControllerService) => {
        const b = batches;
        spyOn(loc, 'retrieveAllLocation').and.returnValues(Observable.of(b));
        loc.retrieveAllLocation().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(187);
        });
      })
    );
  });
});
