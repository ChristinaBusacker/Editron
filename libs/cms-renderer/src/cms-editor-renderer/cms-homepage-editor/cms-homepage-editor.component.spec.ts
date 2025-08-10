import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsHomepageEditorComponent } from './cms-homepage-editor.component';

describe('CmsHomepageEditorComponent', () => {
  let component: CmsHomepageEditorComponent;
  let fixture: ComponentFixture<CmsHomepageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsHomepageEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsHomepageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
