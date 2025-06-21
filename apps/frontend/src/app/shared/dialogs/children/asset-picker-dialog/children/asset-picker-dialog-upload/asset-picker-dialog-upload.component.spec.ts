import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPickerDialogUploadComponent } from './asset-picker-dialog-upload.component';

describe('AssetPickerDialogUploadComponent', () => {
  let component: AssetPickerDialogUploadComponent;
  let fixture: ComponentFixture<AssetPickerDialogUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetPickerDialogUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetPickerDialogUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
