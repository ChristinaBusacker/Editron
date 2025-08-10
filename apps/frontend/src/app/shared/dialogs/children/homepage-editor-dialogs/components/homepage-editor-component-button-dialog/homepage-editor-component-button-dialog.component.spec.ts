import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorComponentButtonDialogComponent } from './homepage-editor-component-button-dialog.component';

describe('HomepageEditorComponentButtonDialogComponent', () => {
  let component: HomepageEditorComponentButtonDialogComponent;
  let fixture: ComponentFixture<HomepageEditorComponentButtonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorComponentButtonDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorComponentButtonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
