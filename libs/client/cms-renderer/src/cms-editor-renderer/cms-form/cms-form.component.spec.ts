import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsFormComponent } from './cms-form.component';

describe('CmsFormComponent', () => {
  let component: CmsFormComponent;
  let fixture: ComponentFixture<CmsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
