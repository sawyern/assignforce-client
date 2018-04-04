import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { CurriculumControllerService } from './curriculum-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { curriculum } from '../../../mockdb/mockdata/curriculum.data';
import { Observable } from 'rxjs/Observable';
import { Curriculum } from '../../../model/Curriculum';

describe('CurriculumControllerService', () => {
  let injector: TestBed;
  let service: CurriculumControllerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurriculumControllerService, HttpClientTestingModule]
    });

    injector = getTestBed();
    service = injector.get(CurriculumControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<Curriculum> from createCurriculum',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'createCurriculum').and.returnValues(Observable.of(c));
        curr.createCurriculum(c[0] as Curriculum).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum> from retrieveCurriculum',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'retrieveCurriculum').and.returnValues(Observable.of(c));
        curr.retrieveCurriculum(2).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum> from updateCurriculum',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'updateCurriculum').and.returnValues(Observable.of(c));
        curr.updateCurriculum(c[0] as Curriculum).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum> from deleteCurriculum',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'deleteCurriculum').and.returnValues(Observable.of(c));
        curr.deleteCurriculum(52).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum[]> from retrieveAllCurricula',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'retrieveAllCurricula').and.returnValues(Observable.of(c));
        curr.retrieveAllCurricula().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum[]> from retrieveAllActiveCurricula',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'retrieveAllActiveCurricula').and.returnValues(Observable.of(c));
        curr.retrieveAllActiveCurricula().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum[]> from retrieveAllCore',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'retrieveAllCore').and.returnValues(Observable.of(c));
        curr.retrieveAllCore().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum[]> from retrieveAllActiveCore',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'retrieveAllActiveCore').and.returnValues(Observable.of(c));
        curr.retrieveAllActiveCore().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum[]> from retrieveAllFocus',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'retrieveAllFocus').and.returnValues(Observable.of(c));
        curr.retrieveAllFocus().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );

    it(
      'should return an Observable<Curriculum[]> from retrieveAllActiveFocus',
      inject([CurriculumControllerService], (curr: CurriculumControllerService) => {
        const c = curriculum;
        spyOn(curr, 'retrieveAllActiveFocus').and.returnValues(Observable.of(c));
        curr.retrieveAllActiveFocus().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].currId).toBe(2);
        });
      })
    );
  });
});
