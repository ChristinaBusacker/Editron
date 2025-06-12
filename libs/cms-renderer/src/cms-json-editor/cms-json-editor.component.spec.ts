import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsJsonEditorComponent } from './cms-json-editor.component';

describe('CmsJsonEditorComponent', () => {
  let component: CmsJsonEditorComponent;
  let fixture: ComponentFixture<CmsJsonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsJsonEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsJsonEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
