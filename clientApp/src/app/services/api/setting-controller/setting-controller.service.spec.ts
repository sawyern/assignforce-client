import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { SettingControllerService } from './setting-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Setting } from '../../../model/setting';
import { settings } from '../../../mockdb/mockdata/setting.data';

describe('SettingControllerService', () => {
  let injector: TestBed;
  let service: SettingControllerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SettingControllerService, HttpClientTestingModule]
    });
    injector = getTestBed();
    service = injector.get(SettingControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<Setting> from createSetting',
      inject([SettingControllerService], (setting: SettingControllerService) => {
        const s = settings;
        spyOn(setting, 'createSetting').and.returnValues(Observable.of(s));
        setting.createSetting(s[0] as Setting).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Setting> from retrieveSetting',
      inject([SettingControllerService], (setting: SettingControllerService) => {
        const s = settings;
        spyOn(setting, 'retrieveSetting').and.returnValues(Observable.of(s));
        setting.retrieveSetting(1).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Setting[]> from getGlobalSetting',
      inject([SettingControllerService], (setting: SettingControllerService) => {
        const s = settings;
        spyOn(setting, 'getGlobalSetting').and.returnValues(Observable.of(s));
        setting.getGlobalSetting().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Setting> from updateSetting',
      inject([SettingControllerService], (setting: SettingControllerService) => {
        const s = settings;
        spyOn(setting, 'updateSetting').and.returnValues(Observable.of(s));
        setting.updateSetting(s[0] as Setting).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );

    it(
      'should return an Observable<Setting> from deleteSetting',
      inject([SettingControllerService], (setting: SettingControllerService) => {
        const s = settings;
        spyOn(setting, 'deleteSetting').and.returnValues(Observable.of(s));
        setting.deleteSetting(1).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].id).toBe(1);
        });
      })
    );
  });
});
