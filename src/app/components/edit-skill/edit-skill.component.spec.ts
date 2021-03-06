import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppMaterialModule } from '../../material.module';
import { Skill } from '../../model/Skill';
import { SkillControllerService } from '../../services/api/skill-controller/skill-controller.service';
import { EditSkillComponent } from './edit-skill.component';

describe('EditSkillComponent', () => {
  let component: EditSkillComponent;
  let fixture: ComponentFixture<EditSkillComponent>;
  const mockDialogData: Skill = { id: 1, name: 'Test Skill', active: true };
  let skillControllerService: SkillControllerService;

  class MockDialogRef {
    close() {}
  }

  class MockSkillController {
    update(skill: Skill) {}
  }

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [EditSkillComponent],
        providers: [
          { provide: MatDialogRef, useClass: MockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
          { provide: SkillControllerService, useClass: MockSkillController }
        ],
        imports: [AppMaterialModule, BrowserAnimationsModule, FormsModule]
      }).compileComponents();
      skillControllerService = TestBed.get(SkillControllerService);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSkillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have name variable populated with current name of skill', () => {
    fixture.detectChanges();
    expect(component.data.name).toContain('Test Skill');
  });

  it('should create a new skill object when the new skill method is called', () => {
    component.newSkill();
    fixture.detectChanges();
    expect(component.skill.name).toBe('');
  });
});
