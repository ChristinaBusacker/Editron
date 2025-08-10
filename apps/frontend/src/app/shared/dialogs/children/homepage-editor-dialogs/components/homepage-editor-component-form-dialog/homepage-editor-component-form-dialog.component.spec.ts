import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorComponentFormDialogComponent } from './homepage-editor-component-form-dialog.component';

describe('HomepageEditorComponentFormDialogComponent', () => {
  let component: HomepageEditorComponentFormDialogComponent;
  let fixture: ComponentFixture<HomepageEditorComponentFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorComponentFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorComponentFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
