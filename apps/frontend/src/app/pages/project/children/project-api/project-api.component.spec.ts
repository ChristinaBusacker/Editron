import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectApiComponent } from './project-api.component';

describe('ProjectApiComponent', () => {
  let component: ProjectApiComponent;
  let fixture: ComponentFixture<ProjectApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectApiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
