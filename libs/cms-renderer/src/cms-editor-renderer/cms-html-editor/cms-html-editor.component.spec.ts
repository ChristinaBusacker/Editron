import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsHtmlEditorComponent } from './cms-html-editor.component';

describe('CmsHtmlEditorComponent', () => {
  let component: CmsHtmlEditorComponent;
  let fixture: ComponentFixture<CmsHtmlEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsHtmlEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsHtmlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
