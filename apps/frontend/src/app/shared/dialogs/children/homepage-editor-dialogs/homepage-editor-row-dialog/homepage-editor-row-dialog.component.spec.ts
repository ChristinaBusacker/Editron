import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorRowDialogComponent } from './homepage-editor-row-dialog.component';

describe('HomepageEditorRowDialogComponent', () => {
  let component: HomepageEditorRowDialogComponent;
  let fixture: ComponentFixture<HomepageEditorRowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorRowDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorRowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
