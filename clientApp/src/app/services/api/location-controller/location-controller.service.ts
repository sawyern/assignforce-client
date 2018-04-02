import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BatchLocation } from '../../../model/BatchLocation';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocationControllerService {
  constructor(private http: HttpClient) {}

  private locationController = environment.apiUrls.locationController;

  public createLocation(location: BatchLocation): Observable<BatchLocation> {
    return this.http.post<BatchLocation>(
      this.locationController.baseUrl + this.locationController.createLocation,
      location
    );
  }

  public updateLocation(location: BatchLocation): Observable<BatchLocation> {
    return this.http.put<BatchLocation>(
      this.locationController.baseUrl + this.locationController.updateLocation,
      location
    );
  }

  public retrieveLocation(id: number): Observable<BatchLocation> {
    return this.http.get<BatchLocation>(
      this.locationController.baseUrl + this.locationController.retrieveLocation + id
    );
  }

  public deleteLocation(id: number): Observable<BatchLocation> {
    return this.http.delete<BatchLocation>(
      this.locationController.baseUrl + this.locationController.deleteLocation + id
    );
  }

  public retrieveAllLocation(): Observable<BatchLocation[]> {
    return this.http.get<BatchLocation[]>(
      this.locationController.baseUrl + this.locationController.retrieveAllLocation
    );
  }
}
