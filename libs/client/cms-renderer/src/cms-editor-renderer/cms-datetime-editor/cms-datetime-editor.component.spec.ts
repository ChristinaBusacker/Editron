import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsDatetimeEditorComponent } from './cms-datetime-editor.component';

describe('CmsDatetimeEditorComponent', () => {
  let component: CmsDatetimeEditorComponent;
  let fixture: ComponentFixture<CmsDatetimeEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsDatetimeEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsDatetimeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
