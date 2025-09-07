import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsTagEditorComponent } from './cms-tag-editor.component';

describe('CmsTagEditorComponent', () => {
  let component: CmsTagEditorComponent;
  let fixture: ComponentFixture<CmsTagEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsTagEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsTagEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
