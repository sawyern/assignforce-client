import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Curriculum } from '../../../model/Curriculum';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurriculumControllerService {
  constructor(private http: HttpClient) {}

  private curriculumController = environment.apiUrls.curriculumController;

  public createCurriculum(curriculum: Curriculum): Observable<Curriculum> {
    return this.http.post<Curriculum>(
      this.curriculumController.baseUrl + this.curriculumController.createCurriculum,
      curriculum
    );
  }

  public retrieveCurriculum(id: number): Observable<Curriculum> {
    return this.http.get<Curriculum>(
      this.curriculumController.baseUrl + this.curriculumController.retrieveCurriculum + id
    );
  }

  public updateCurriculum(curriculum: Curriculum): Observable<Curriculum> {
    return this.http.put<Curriculum>(
      this.curriculumController.baseUrl + this.curriculumController.updateCurriculum,
      curriculum
    );
  }

  public deleteCurriculum(id: number): Observable<Curriculum> {
    return this.http.delete<Curriculum>(
      this.curriculumController.baseUrl + this.curriculumController.deleteCurriculum + id
    );
  }

  public retrieveAllCurricula(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(
      this.curriculumController.baseUrl + this.curriculumController.retrieveAllCurricula
    );
  }

  public retrieveAllActiveCurricula(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(
      this.curriculumController.baseUrl + this.curriculumController.retrieveAllActiveCore
    );
  }

  public retrieveAllCore(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(this.curriculumController.baseUrl + this.curriculumController.retrieveAllCore);
  }

  public retrieveAllActiveCore(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(
      this.curriculumController.baseUrl + this.curriculumController.retrieveAllActiveCore
    );
  }

  public retrieveAllFocus(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(this.curriculumController.baseUrl + this.curriculumController.retrieveAllFocus);
  }

  public retrieveAllActiveFocus(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(
      this.curriculumController.baseUrl + this.curriculumController.retrieveAllActiveFocus
    );
  }
}
