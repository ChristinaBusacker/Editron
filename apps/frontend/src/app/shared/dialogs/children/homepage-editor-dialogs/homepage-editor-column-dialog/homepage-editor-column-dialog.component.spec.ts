import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorColumnDialogComponent } from './homepage-editor-column-dialog.component';

describe('HomepageEditorColumnDialogComponent', () => {
  let component: HomepageEditorColumnDialogComponent;
  let fixture: ComponentFixture<HomepageEditorColumnDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorColumnDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorColumnDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
