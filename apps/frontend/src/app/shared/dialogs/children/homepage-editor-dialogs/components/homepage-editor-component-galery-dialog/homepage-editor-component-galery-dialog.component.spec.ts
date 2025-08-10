import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorComponentGaleryDialogComponent } from './homepage-editor-component-galery-dialog.component';

describe('HomepageEditorComponentGaleryDialogComponent', () => {
  let component: HomepageEditorComponentGaleryDialogComponent;
  let fixture: ComponentFixture<HomepageEditorComponentGaleryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorComponentGaleryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorComponentGaleryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
