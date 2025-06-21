import { Component, inject } from '@angular/core';
import { DialogComponent } from '../../dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AssetPickerDialogSelectionComponent } from './children/asset-picker-dialog-selection/asset-picker-dialog-selection.component';
import { AssetPickerDialogUploadComponent } from './children/asset-picker-dialog-upload/asset-picker-dialog-upload.component';
import { AssetPickerDialogUrlComponent } from './children/asset-picker-dialog-url/asset-picker-dialog-url.component';
import { Asset } from '@frontend/shared/services/api/models/asset.model';

@Component({
  selector: 'app-asset-picker-dialog',
  imports: [
    DialogComponent,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    AssetPickerDialogSelectionComponent,
    AssetPickerDialogUploadComponent,
    AssetPickerDialogUrlComponent,
  ],
  templateUrl: './asset-picker-dialog.component.html',
  styleUrl: './asset-picker-dialog.component.scss',
})
export class AssetPickerDialogComponent {
  dialogRef = inject(MatDialogRef<AssetPickerDialogComponent>);

  module: 'selection' | 'upload' | 'url' = 'selection';

  selectedAsset?: Asset;

  getConfirmButton() {
    if (this.module === 'selection') {
      return {
        label: 'Select Asset',
        color: 'primary',
        disabled: this.selectedAsset === undefined,
      };
    }

    return undefined;
  }

  onAssetSelect(asset: Asset) {
    this.selectedAsset = asset;
  }

  onFileUplaod() {
    this.module = 'selection';
  }

  close(action: 'confirm' | 'cancel') {
    if (action === 'confirm') {
      return this.dialogRef.close({
        action,
        data: { asset: this.selectedAsset },
      });
    }
    this.dialogRef.close({ action, data: {} });
  }
}
