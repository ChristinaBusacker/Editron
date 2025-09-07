import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsFormFieldComponent } from './cms-form-field.component';

describe('CmsFormFieldComponent', () => {
  let component: CmsFormFieldComponent;
  let fixture: ComponentFixture<CmsFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsFormFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
