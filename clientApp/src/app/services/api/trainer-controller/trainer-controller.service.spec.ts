import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { TrainerControllerService } from './trainer-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { trainers } from '../../../mockdb/mockdata/trainer.data';
import { Observable } from 'rxjs/Observable';
import { Trainer } from '../../../model/Trainer';

describe('TrainerControllerService', () => {
  let injector: TestBed;
  let service: TrainerControllerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TrainerControllerService, HttpClientTestingModule]
    });

    injector = getTestBed();
    service = injector.get(TrainerControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<Trainer> from createTrainer',
      inject([TrainerControllerService], (setting: TrainerControllerService) => {
        const t = trainers;
        spyOn(setting, 'createTrainer').and.returnValues(Observable.of(t));
        setting.createTrainer(t[0] as Trainer).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].trainerId).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Trainer> from updateTrainer',
      inject([TrainerControllerService], (setting: TrainerControllerService) => {
        const t = trainers;
        spyOn(setting, 'updateTrainer').and.returnValues(Observable.of(t));
        setting.updateTrainer(t[0] as Trainer).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].trainerId).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Trainer> from findTrainer',
      inject([TrainerControllerService], (setting: TrainerControllerService) => {
        const t = trainers;
        spyOn(setting, 'findTrainer').and.returnValues(Observable.of(t));
        setting.findTrainer('hello@gmail.com').subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].trainerId).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Trainer> from makeInactive',
      inject([TrainerControllerService], (setting: TrainerControllerService) => {
        const t = trainers;
        spyOn(setting, 'makeInactive').and.returnValues(Observable.of(t));
        setting.makeInactive(12).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].trainerId).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Trainer[]> from getAllTrainersTitles',
      inject([TrainerControllerService], (setting: TrainerControllerService) => {
        const t = trainers;
        spyOn(setting, 'getAllTrainersTitles').and.returnValues(Observable.of(t));
        setting.getAllTrainersTitles().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].trainerId).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Trainer[]> from getAllTrainers',
      inject([TrainerControllerService], (setting: TrainerControllerService) => {
        const t = trainers;
        spyOn(setting, 'getAllTrainers').and.returnValues(Observable.of(t));
        setting.getAllTrainers().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].trainerId).toBe(1);
        });
      })
    );
  });
});
