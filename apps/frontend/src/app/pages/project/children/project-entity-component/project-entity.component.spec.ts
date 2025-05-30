import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectEntityComponentComponent } from './project-entity-component.component';

describe('ProjectEntityComponentComponent', () => {
  let component: ProjectEntityComponentComponent;
  let fixture: ComponentFixture<ProjectEntityComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectEntityComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectEntityComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
