import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBinComponent } from './project-bin.component';

describe('ProjectBinComponent', () => {
  let component: ProjectBinComponent;
  let fixture: ComponentFixture<ProjectBinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectBinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
