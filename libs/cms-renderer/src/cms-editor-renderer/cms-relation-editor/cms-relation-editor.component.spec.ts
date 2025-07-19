import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsRelationEditorComponent } from './cms-relation-editor.component';

describe('CmsRelationEditorComponent', () => {
  let component: CmsRelationEditorComponent;
  let fixture: ComponentFixture<CmsRelationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsRelationEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsRelationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
