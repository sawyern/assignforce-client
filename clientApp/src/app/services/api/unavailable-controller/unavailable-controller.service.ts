import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Unavailability } from '../../../model/Unavailability';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UnavailableControllerService {
  constructor(private http: HttpClient) {}

  private unavailableController = environment.apiUrls.unavailableController;

  public createUnavailability(unavailability: Unavailability): Observable<Unavailability> {
    return this.http.post<Unavailability>(
      this.unavailableController.baseUrl + this.unavailableController.createUnavailability,
      unavailability
    );
  }

  public retrieveUnavailability(id: number): Observable<Unavailability> {
    return this.http.get<Unavailability>(
      this.unavailableController.baseUrl + this.unavailableController.retrieveUnavailability + id
    );
  }

  public deleteUnavailability(id: number): Observable<Unavailability> {
    return this.http.delete<Unavailability>(
      this.unavailableController.baseUrl + this.unavailableController.deleteUnavailability + id
    );
  }

  public retrieveAllUnavailabilities(): Observable<Unavailability[]> {
    return this.http.get<Unavailability[]>(
      this.unavailableController.baseUrl + this.unavailableController.retrieveAllUnavailabilities
    );
  }
}
