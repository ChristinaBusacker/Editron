import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorComponentTextDialogComponent } from './homepage-editor-component-text-dialog.component';

describe('HomepageEditorComponentTextDialogComponent', () => {
  let component: HomepageEditorComponentTextDialogComponent;
  let fixture: ComponentFixture<HomepageEditorComponentTextDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorComponentTextDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorComponentTextDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
