import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPickerDialogComponent } from './asset-picker-dialog.component';

describe('AssetPickerDialogComponent', () => {
  let component: AssetPickerDialogComponent;
  let fixture: ComponentFixture<AssetPickerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetPickerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetPickerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
