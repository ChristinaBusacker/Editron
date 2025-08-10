import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorComponentImageDialogComponent } from './homepage-editor-component-image-dialog.component';

describe('HomepageEditorComponentImageDialogComponent', () => {
  let component: HomepageEditorComponentImageDialogComponent;
  let fixture: ComponentFixture<HomepageEditorComponentImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorComponentImageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorComponentImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
