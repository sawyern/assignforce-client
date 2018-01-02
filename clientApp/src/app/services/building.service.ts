import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Building} from '../domain/building';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class BuildingService {

  url = 'https://location-service.cfapps.io/api/v2/building';

  constructor(private http: HttpClient) {
  }

  // Gets all Building in the database
  getAll(): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.url}`);
  }

  // Gets 1 Building by their ID
  getById(id): Observable<Building> {
    return this.http.get<Building>(`${this.url}/${id}`);
  }

  // Adds a new Building to the database
  create(building: Building): Observable<any> {
    return this.http.post<any>(`${this.url}`, building);
  }

  // Updates information about a given Building
  update(building: Building): Observable<any> {
    return this.http.put<any>(`${this.url}`, building);
  }

  delete(building: Building): Observable<any> {
    return this.http.delete<any>(`${this.url}/${building.id}`);
  }
}
