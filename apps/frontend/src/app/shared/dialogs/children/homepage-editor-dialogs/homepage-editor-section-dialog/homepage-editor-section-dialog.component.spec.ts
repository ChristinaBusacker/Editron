import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorSectionDialogComponent } from './homepage-editor-section-dialog.component';

describe('HomepageEditorSectionDialogComponent', () => {
  let component: HomepageEditorSectionDialogComponent;
  let fixture: ComponentFixture<HomepageEditorSectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorSectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorSectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
