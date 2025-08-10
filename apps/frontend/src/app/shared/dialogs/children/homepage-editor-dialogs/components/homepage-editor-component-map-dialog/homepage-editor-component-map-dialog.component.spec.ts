import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorComponentMapDialogComponent } from './homepage-editor-component-map-dialog.component';

describe('HomepageEditorComponentMapDialogComponent', () => {
  let component: HomepageEditorComponentMapDialogComponent;
  let fixture: ComponentFixture<HomepageEditorComponentMapDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorComponentMapDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorComponentMapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
