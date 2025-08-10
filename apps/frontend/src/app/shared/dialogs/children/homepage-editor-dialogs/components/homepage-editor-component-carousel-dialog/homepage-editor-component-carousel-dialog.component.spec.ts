import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageEditorComponentCarouselDialogComponent } from './homepage-editor-component-carousel-dialog.component';

describe('HomepageEditorComponentCarouselDialogComponent', () => {
  let component: HomepageEditorComponentCarouselDialogComponent;
  let fixture: ComponentFixture<HomepageEditorComponentCarouselDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageEditorComponentCarouselDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageEditorComponentCarouselDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
