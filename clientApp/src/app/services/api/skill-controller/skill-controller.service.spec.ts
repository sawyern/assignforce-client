import { TestBed, inject } from '@angular/core/testing';

import { SkillControllerService } from './skill-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('SkillControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkillControllerService, HttpClient, HttpHandler]
    });
  });

  it(
    'should be created',
    inject([SkillControllerService], (service: SkillControllerService) => {
      expect(service).toBeTruthy();
    })
  );
});
