import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsGeolocationEditorComponent } from './cms-geolocation-editor.component';

describe('CmsGeolocationEditorComponent', () => {
  let component: CmsGeolocationEditorComponent;
  let fixture: ComponentFixture<CmsGeolocationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsGeolocationEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsGeolocationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
