import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsAssetEditorComponent } from './cms-asset-editor.component';

describe('CmsAssetEditorComponent', () => {
  let component: CmsAssetEditorComponent;
  let fixture: ComponentFixture<CmsAssetEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsAssetEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsAssetEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
