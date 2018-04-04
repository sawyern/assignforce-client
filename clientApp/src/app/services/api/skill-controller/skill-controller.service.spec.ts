import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { SkillControllerService } from './skill-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { skills } from '../../../mockdb/mockdata/skill.data';
import { Observable } from 'rxjs/Observable';
import { Skill } from '../../../model/Skill';
describe('SkillControllerService', () => {
  let injector: TestBed;
  let service: SkillControllerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SkillControllerService, HttpClient, HttpHandler]
    });
    injector = getTestBed();
    service = injector.get(SkillControllerService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('gettingBatches', () => {
    it(
      'should return an Observable<Skill[]> from findAllActive',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'findAllActive').and.returnValues(Observable.of(s));
        setting.findAllActive().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill[]> from findAll',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'findAll').and.returnValues(Observable.of(s));
        setting.findAll().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill> from findSkillById',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'findSkillById').and.returnValues(Observable.of(s));
        setting.findSkillById(4).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill> from updateSkillCaliber',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'updateSkillCaliber').and.returnValues(Observable.of(s));
        setting.updateSkillCaliber(s[0] as Skill).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill> from saveSkill',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'saveSkill').and.returnValues(Observable.of(s));
        setting.saveSkill(s[0] as Skill).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill> from retrieveSkill',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'retrieveSkill').and.returnValues(Observable.of(s));
        setting.retrieveSkill(4).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill> from updateSkillMinerva',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'updateSkillMinerva').and.returnValues(Observable.of(s));
        setting.updateSkillMinerva(s[0] as Skill).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill> from deleteSkill',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'deleteSkill').and.returnValues(Observable.of(s));
        setting.deleteSkill(4).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill[]> from retrieveAllSkills',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'retrieveAllSkills').and.returnValues(Observable.of(s));
        setting.retrieveAllSkills().subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );

    it(
      'should return an Observable<Skill[]> from retrieveSkillsByIds',
      inject([SkillControllerService], (setting: SkillControllerService) => {
        const s = skills;
        spyOn(setting, 'retrieveSkillsByIds').and.returnValues(Observable.of(s));
        setting.retrieveSkillsByIds([1, 2]).subscribe(result => {
          expect(result).toBeTruthy();
          expect(result[0].skillId).toBe(4);
        });
      })
    );
  });
});
