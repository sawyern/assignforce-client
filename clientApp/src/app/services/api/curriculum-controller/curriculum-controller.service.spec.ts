import { TestBed, inject } from '@angular/core/testing';

import { CurriculumControllerService } from './curriculum-controller.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CurriculumControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurriculumControllerService, HttpClient, HttpHandler]
    });
  });

  it(
    'should be created',
    inject([CurriculumControllerService], (service: CurriculumControllerService) => {
      expect(service).toBeTruthy();
    })
  );
});
