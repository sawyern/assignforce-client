import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Setting } from '../../../model/setting';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SettingControllerService {
  constructor(private http: HttpClient) {}

  private settingController = environment.apiUrls.settingController;

  public createSetting(setting: Setting): Observable<Setting> {
    return this.http.post<Setting>(this.settingController.baseUrl + this.settingController.createSetting, setting);
  }

  public retrieveSetting(id: number): Observable<Setting> {
    return this.http.get<Setting>(this.settingController.baseUrl + this.settingController.retrieveSetting + id);
  }

  public getGlobalSetting(): Observable<Setting[]> {
    return this.http.get<Setting[]>(this.settingController.baseUrl + this.settingController.getGlobalSetting);
  }

  public updateSetting(setting: Setting): Observable<Setting> {
    return this.http.put<Setting>(this.settingController.baseUrl + this.settingController.updateSetting, setting);
  }

  public deleteSetting(id: number): Observable<Setting> {
    return this.http.delete<Setting>(this.settingController.baseUrl + this.settingController.deleteSetting + id);
  }
}
