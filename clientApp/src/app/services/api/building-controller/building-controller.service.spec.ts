import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { BuildingControllerService } from './building-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { buildings } from '../../../mockdb/mockdata/building.data';
import { Building } from '../../../model/Building';

describe('BuildingControllerService', () => {
  let injector: TestBed;
  let service: BuildingControllerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BuildingControllerService, HttpClientTestingModule]
    });

    injector = getTestBed();
    service = injector.get(BuildingControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<Building> from createBuilding',
      inject([BuildingControllerService], (building: BuildingControllerService) => {
        const b = buildings;
        spyOn(building, 'createBuilding').and.returnValues(Observable.of(b));
        building.createBuilding(b[0] as Building).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(52);
        });
      })
    );

    it(
      'should return an Observable<Building> from retrieveBuilding',
      inject([BuildingControllerService], (building: BuildingControllerService) => {
        const b = buildings;
        spyOn(building, 'retrieveBuilding').and.returnValues(Observable.of(b));
        building.retrieveBuilding(52).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(52);
        });
      })
    );

    it(
      'should return an Observable<Building> from updateBuilding',
      inject([BuildingControllerService], (building: BuildingControllerService) => {
        const b = buildings;
        spyOn(building, 'updateBuilding').and.returnValues(Observable.of(b));
        building.updateBuilding(b[0] as Building).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(52);
        });
      })
    );

    it(
      'should return an Observable<Building> from deleteBuilding',
      inject([BuildingControllerService], (building: BuildingControllerService) => {
        const b = buildings;
        spyOn(building, 'deleteBuilding').and.returnValues(Observable.of(b));
        building.deleteBuilding(52).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(52);
        });
      })
    );

    it(
      'should return an Observable<Building> from retrieveAllBuildings',
      inject([BuildingControllerService], (building: BuildingControllerService) => {
        const b = buildings;
        spyOn(building, 'retrieveAllBuildings').and.returnValues(Observable.of(b));
        building.retrieveAllBuildings().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(52);
        });
      })
    );
  });
});
