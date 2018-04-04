import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { AddressControllerService } from './address-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { locations } from '../../../mockdb/mockdata/location.data';
import { Observable } from 'rxjs/Observable';
import { Location } from '../../../model/Location';

describe('AddressControllerService', () => {
  let injector: TestBed;
  let service: AddressControllerService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressControllerService, HttpClientTestingModule]
    });
    injector = getTestBed();
    service = injector.get(AddressControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<Location> from createLocation',
      inject([AddressControllerService], (address: AddressControllerService) => {
        const l = locations;
        spyOn(address, 'createLocation').and.returnValues(Observable.of(l));
        address.createLocation(l[0] as Location).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Location> from updateLocation',
      inject([AddressControllerService], (address: AddressControllerService) => {
        const l = locations;
        spyOn(address, 'updateLocation').and.returnValues(Observable.of(l));
        address.updateLocation(l[0] as Location).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Location[]> from getAllLocations',
      inject([AddressControllerService], (address: AddressControllerService) => {
        const l = locations;
        spyOn(address, 'getAllLocations').and.returnValues(Observable.of(l));
        address.getAllLocations().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Location> from removeLocations',
      inject([AddressControllerService], (address: AddressControllerService) => {
        const l = locations;
        spyOn(address, 'removeLocations').and.returnValues(Observable.of(l));
        address.removeLocations(l[0] as Location).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Location> from reactivateLocation',
      inject([AddressControllerService], (address: AddressControllerService) => {
        const l = locations;
        spyOn(address, 'reactivateLocation').and.returnValues(Observable.of(l));
        address.reactivateLocation(l[0] as Location).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Location> from getLocation',
      inject([AddressControllerService], (address: AddressControllerService) => {
        const l = locations;
        spyOn(address, 'getLocation').and.returnValues(Observable.of(l));
        address.getLocation(1).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );
  });
});
