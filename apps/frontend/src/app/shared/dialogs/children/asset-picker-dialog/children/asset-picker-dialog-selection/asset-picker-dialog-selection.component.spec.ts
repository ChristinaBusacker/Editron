import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPickerDialogSelectionComponent } from './asset-picker-dialog-selection.component';

describe('AssetPickerDialogSelectionComponent', () => {
  let component: AssetPickerDialogSelectionComponent;
  let fixture: ComponentFixture<AssetPickerDialogSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetPickerDialogSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetPickerDialogSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
