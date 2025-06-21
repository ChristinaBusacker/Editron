import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPickerDialogUrlComponent } from './asset-picker-dialog-url.component';

describe('AssetPickerDialogUrlComponent', () => {
  let component: AssetPickerDialogUrlComponent;
  let fixture: ComponentFixture<AssetPickerDialogUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetPickerDialogUrlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetPickerDialogUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
