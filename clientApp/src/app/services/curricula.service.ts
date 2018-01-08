import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Curriculum} from '../domain/curriculum';

@Injectable()
export class CurriculaService {

  // url = 'http://localhost:9093/api/v2/curriculum';
  // url = 'https://curriculum-service.cfapps.io/api/v2/curriculum';
  url = 'https://assignforcebackend.cfapps.io/api/curriculum/api/v2/curriculum';
  constructor(private http: HttpClient) { }

  /* services */


  // Get all curricula
  getAll(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.url}`);
  }

  // Get all active curricula
  getAllActive(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(`${this.url}/active`);
  }

  // Get curriculum by id

  getById(id): Observable<Curriculum> {
    return this.http.get<Curriculum>(`${this.url}/${id}`);
  }

  // Create new curriculum
  create(curriculum: Curriculum): Observable<Curriculum> {
    return this.http.post<Curriculum>(`${this.url}`, curriculum);
  }


  // Update Curriculum
  update(curriculum: Curriculum): Observable<Curriculum> {
    return this.http.put<Curriculum>(`${this.url}`, curriculum);
  }

  // Delete Curriculum
  delete(currId): Observable<object> {
    return this.http.delete<Object>(`${this.url}/${currId}`);
  }
}
