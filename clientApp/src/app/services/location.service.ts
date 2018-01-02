import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Locations} from '../domain/locations';

@Injectable()
export class LocationService {

  url = 'https://location-service.cfapps.io/api/v2/location';

  constructor(private http: HttpClient) {
  }

  // Gets all Locations in the database
  getAll(): Observable<Locations[]> {
    return this.http.get<Locations[]>(`${this.url}`);
  }

  // Gets 1 Locations by their ID
  getById(id): Observable<Locations> {
    return this.http.get<Locations>(`${this.url}/${id}`);
  }

  // Adds a new Locations to the database
  create(location: Locations): Observable<any> {
    return this.http.post<any>(`${this.url}`, location);
  }

  // Updates information about a given Locations
  update(location: Locations): Observable<any> {
    return this.http.put<any>(`${this.url}`, location);
  }

  delete(location: Locations): Observable<any> {
    return this.http.delete<any>(`${this.url}/${location.id}`);
  }
}
