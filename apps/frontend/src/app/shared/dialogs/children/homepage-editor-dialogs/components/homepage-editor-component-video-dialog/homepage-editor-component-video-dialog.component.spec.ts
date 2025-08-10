import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorComponentVideoDialogComponent } from './homepage-editor-component-video-dialog.component';

describe('HomepageEditorComponentVideoDialogComponent', () => {
  let component: HomepageEditorComponentVideoDialogComponent;
  let fixture: ComponentFixture<HomepageEditorComponentVideoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorComponentVideoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorComponentVideoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
