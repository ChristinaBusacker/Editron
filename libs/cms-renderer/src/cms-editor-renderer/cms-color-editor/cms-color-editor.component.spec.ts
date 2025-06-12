import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsColorEditorComponent } from './cms-color-editor.component';

describe('CmsColorEditorComponent', () => {
  let component: CmsColorEditorComponent;
  let fixture: ComponentFixture<CmsColorEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsColorEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsColorEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
