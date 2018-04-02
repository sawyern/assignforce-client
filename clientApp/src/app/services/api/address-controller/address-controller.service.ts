import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Location } from '../../../model/Location';

@Injectable()
export class AddressControllerService {
  constructor(private http: HttpClient) {}

  private addressController = environment.apiUrls.addressController;

  public createLocation(location: Location): Observable<Location> {
    return this.http.post<Location>(this.addressController.baseUrl + this.addressController.createLocation, location);
  }
  public updateLocation(location: Location): Observable<Location> {
    return this.http.put<Location>(this.addressController.baseUrl + this.addressController.updateLocation, location);
  }
  public getAllLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.addressController.baseUrl + this.addressController.getAllLocations);
  }
  public removeLocations(location: Location): Observable<Location> {
    //todo
    return null;
  }
  public reactivateLocation(location: Location): Observable<Location> {
    return this.http.put<Location>(
      this.addressController.baseUrl + this.addressController.reactivateLocation,
      location
    );
  }

  public getLocation(id: number): Observable<Location> {
    return this.http.get<Location>(this.addressController.baseUrl + this.addressController.getLocation + id);
  }
}
