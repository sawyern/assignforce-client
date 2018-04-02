import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Skill } from '../../../model/Skill';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SkillControllerService {
  constructor(private http: HttpClient) {}

  private skillController = environment.apiUrls.skillController;

  public findAllActive(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.skillController.baseUrl + this.skillController.findAllActive);
  }

  public findAll(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.skillController.baseUrl + this.skillController.findAll);
  }

  public findSkillById(id: number): Observable<Skill> {
    return this.http.get<Skill>(this.skillController.baseUrl + this.skillController.findSkillById + id);
  }

  public updateSkillCaliber(skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(this.skillController.baseUrl + this.skillController.updateSkillCaliber, skill);
  }

  public saveSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(this.skillController.baseUrl + this.skillController.saveSkill, skill);
  }

  public retrieveSkill(id: number): Observable<Skill> {
    return this.http.get<Skill>(this.skillController.baseUrl + this.skillController.retrieveSkill + id);
  }

  public updateSkillMinerva(skill: Skill): Observable<Skill> {
    return this.http.put<Skill>(this.skillController.baseUrl + this.skillController.updateSkillMinerva, skill);
  }

  public deleteSkill(id: number): Observable<Skill> {
    return this.http.delete<Skill>(this.skillController.baseUrl + this.skillController.deleteSkill + id);
  }

  public retrieveAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.skillController.baseUrl + this.skillController.retrieveAllSkills);
  }

  public retrieveSkillsByIds(ids: number[]): Observable<Skill[]> {
    return this.http.post<Skill[]>(this.skillController.baseUrl + this.skillController.retrieveSkillsByIds, ids);
  }
}
