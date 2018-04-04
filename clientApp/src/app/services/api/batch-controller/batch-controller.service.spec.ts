import { TestBed, inject, async, getTestBed } from '@angular/core/testing';

import { BatchControllerService } from './batch-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { batches } from '../../../mockdb/mockdata/batch.data';
import { Observable } from 'rxjs/Observable';
import { Batch } from '../../../model/batch';
import { locations } from '../../../mockdb/mockdata/location.data';
// import { from } from 'rxjs/Observable/from';
import 'rxjs/add/observable/from';

describe('BatchControllerService', () => {
  let injector: TestBed;
  let service: BatchControllerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BatchControllerService, HttpClientTestingModule]
    });

    injector = getTestBed();
    service = injector.get(BatchControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<batches[]> from createBatch',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const b = batches;
        spyOn(batch, 'createBatch').and.returnValues(Observable.of(b));
        batch.createBatch(b[0] as Batch).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(187);
        });
      })
    );

    it(
      'should return an Observable<batches[]> from deleteBatch',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const b = batches;
        spyOn(batch, 'deleteBatch').and.returnValues(Observable.of(b));
        batch.deleteBatch(187).subscribe(res => {
          expect(res).toBeTruthy();
          expect(res[0].id).toBe(187);
        });
      })
    );

    it(
      'should return an Observable<batches[]> from updateBatch',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const b = batches;
        spyOn(batch, 'updateBatch').and.returnValues(Observable.of(b));
        batch.updateBatch(b[0] as Batch).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(187);
        });
      })
    );

    it(
      'should return an Observable<Location[]> from findCommonLocations',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const l = locations;
        spyOn(batch, 'findCommonLocations').and.returnValues(Observable.of(l));
        batch.findCommonLocations().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<batches[]> from getAllBatches',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const b = batches;
        spyOn(batch, 'getAllBatches').and.returnValues(Observable.of(b));
        batch.getAllBatches().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(187);
        });
      })
    );

    it(
      'should return an Observable<batches[]> from findAllBatchesByTrainer',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const b = batches;
        spyOn(batch, 'findAllBatchesByTrainer').and.returnValues(Observable.of(b));
        batch.findAllBatchesByTrainer().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(187);
        });
      })
    );

    it(
      'should return an Observable<batches> from createWeek',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const b = batches[0];
        spyOn(batch, 'createWeek').and.returnValues(Observable.of(b));
        batch.createWeek(1).subscribe(result => {
          expect(result).toBeTruthy();
        });
      })
    );

    it(
      'should return an Observable<batches[]> from getAllVpBatches',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const b = batches;
        spyOn(batch, 'getAllVpBatches').and.returnValues(Observable.of(b));
        batch.getAllVpBatches().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(187);
        });
      })
    );

    it(
      'should return an Observable<batches[]> from getAllCurrentBatches',
      inject([BatchControllerService], (batch: BatchControllerService) => {
        const b = batches;
        spyOn(batch, 'getAllCurrentBatches').and.returnValues(Observable.of(b));
        batch.getAllCurrentBatches().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(187);
        });
      })
    );
  });
});
