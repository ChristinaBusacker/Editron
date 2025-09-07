import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsRichtextEditorComponent } from './cms-richtext-editor.component';

describe('CmsRichtextEditorComponent', () => {
  let component: CmsRichtextEditorComponent;
  let fixture: ComponentFixture<CmsRichtextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsRichtextEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsRichtextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
