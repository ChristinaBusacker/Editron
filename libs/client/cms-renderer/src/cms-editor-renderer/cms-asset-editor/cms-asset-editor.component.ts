import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from '@frontend/shared/dialogs/dialog.service';
import { AssetService } from '@frontend/shared/services/api/asset.service';
import { Asset } from '@frontend/shared/services/api/models/asset.model';

@Component({
  selector: 'lib-cms-asset-editor',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './cms-asset-editor.component.html',
  styleUrl: './cms-asset-editor.component.scss',
})
export class CmsAssetEditorComponent {
  @Input({ required: true }) control: FormControl;
  @Input() multiSelect: boolean = true;
  @Input() label: string = 'image';

  constructor(
    private dialogService: DialogService,
    private assetService: AssetService,
  ) {}
  public openAssetDialog() {
    this.dialogService
      .openAssetPickerDialog({
        multiSelect: this.multiSelect,
        value: this.control.value,
      })
      .afterClosed()
      .subscribe(response => {
        if (response.action === 'confirm') {
          if (this.multiSelect) {
            const assets = response.data.assets as Asset[];
            this.control.patchValue(assets.map(a => a.id));
          } else {
            const asset = response.data.asset as Asset;
            this.control.patchValue(asset.id);
          }
        }
      });
  }

  removeImage(id: string) {
    const value = this.control.value as string[];
    this.control.patchValue(value.filter(v => v !== id));
  }

  generateThumbnailIdAssetUrl(id: string) {
    return `${this.assetService.baseUrl}/${id}/small`;
  }

  controlVal() {
    if (typeof this.control.value === 'string') {
      return [this.control.value];
    }

    return this.control.value;
  }
}
