import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreComponent } from './core.component';
import { AppMaterialModule } from '../../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
import { CurriculaService } from '../../services/curricula/curricula.service';
import { of } from 'rxjs/Observable/of';
import { Curriculum } from '../../model/Curriculum';

describe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;
  const testData: Curriculum[] = [
    new Curriculum(1, 'Test Curriculum', true, true, [{ skillId: 1, name: 'Test Skill', active: true }]),
    new Curriculum(2, 'Test Curriculum 2', true, true, [{ skillId: 1, name: 'Test Skill', active: true }])
  ];
  let curriculaService = CurriculaService;

  class MockCurriculaService {
    getCurricula(): Observable<Curriculum[]> {
      return Observable.of(testData);
    }
  }

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [AppMaterialModule, BrowserAnimationsModule],
        declarations: [CoreComponent],
        providers: [{ provide: CurriculaService, useClass: MockCurriculaService }]
      }).compileComponents();
      curriculaService = TestBed.get(CurriculaService);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a mat-list', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-list')).toBeTruthy();
  });

  it('should contain the core name', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.core-name').textContent).toContain(component.coreData[0].name);
  });

  it('should contain the skills for the core', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.core-skills').textContent).toContain(component.coreData[0].skills[0].name);
  });

  it('should contain an accordion for core curriculum', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-accordion')).toBeTruthy();
  });

  it('should contain a title named Core Curricula', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('mat-panel-title').textContent).toContain('Core Curricula');
  });
});
