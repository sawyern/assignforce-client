import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Building } from '../../../model/Building';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BuildingControllerService {
  constructor(private http: HttpClient) {}

  private buildingController = environment.apiUrls.buildingController;

  public createBuilding(building: Building): Observable<Building> {
    return this.http.post<Building>(
      this.buildingController.baseUrl + this.buildingController.createBuilding,
      this.buildingController
    );
  }

  public retrieveBuilding(id: number): Observable<Building> {
    return this.http.get<Building>(this.buildingController.baseUrl + this.buildingController.retrieveBuilding + id);
  }

  public updateBuilding(building: Building): Observable<Building> {
    return this.http.put<Building>(this.buildingController.baseUrl + this.buildingController.updateBuilding, building);
  }

  public deleteBuilding(id: number): Observable<Building> {
    return this.http.delete<Building>(this.buildingController.baseUrl + this.buildingController.deleteBuilding + id);
  }

  public retrieveAllBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.buildingController.baseUrl + this.buildingController.retrieveAllBuildings);
  }
}
