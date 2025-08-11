import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
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
export class AssetPickerDialogComponent implements OnInit {
  dialogRef = inject(MatDialogRef<AssetPickerDialogComponent>);
  dialogData: { multiSelect: boolean; value: string | string[] } =
    inject(MAT_DIALOG_DATA);

  module: 'selection' | 'upload' | 'url' = 'selection';

  multiSelect: boolean = !!this.dialogData?.multiSelect;
  selectedAssets: Asset[] = [];
  selectedAsset?: Asset;

  ngOnInit(): void {}

  getConfirmButton() {
    if (this.module === 'selection') {
      return {
        label: this.multiSelect ? 'Select Assets' : 'Select Asset',
        color: 'primary',
        disabled: this.multiSelect
          ? this.selectedAssets.length === 0
          : this.selectedAsset === undefined,
      };
    }
    return undefined;
  }

  onAssetSelect(asset: Asset) {
    if (this.multiSelect) {
      const idx = this.selectedAssets.findIndex(a => a.id === asset.id);
      if (idx > -1) {
        this.selectedAssets = this.selectedAssets.filter(
          a => a.id !== asset.id,
        );
      } else {
        this.selectedAssets = [...this.selectedAssets, asset];
      }
    } else {
      this.selectedAsset = asset;
    }
  }

  onFileUplaod() {
    this.module = 'selection';
  }

  close(action: 'confirm' | 'cancel') {
    if (action === 'confirm') {
      return this.dialogRef.close({
        action,
        data: this.multiSelect
          ? { assets: this.selectedAssets }
          : { asset: this.selectedAsset },
      });
    }
    this.dialogRef.close({ action, data: {} });
  }
}
