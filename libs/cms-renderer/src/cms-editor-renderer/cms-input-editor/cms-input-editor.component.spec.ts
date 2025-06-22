import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsInputEditorComponent } from './cms-input-editor.component';

describe('CmsInputEditorComponent', () => {
  let component: CmsInputEditorComponent;
  let fixture: ComponentFixture<CmsInputEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsInputEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsInputEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
