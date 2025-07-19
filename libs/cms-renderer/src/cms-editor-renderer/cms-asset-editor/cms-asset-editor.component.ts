import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DialogService } from '@frontend/shared/dialogs/dialog.service';
import { AssetService } from '@frontend/shared/services/api/asset.service';
import { Asset } from '@frontend/shared/services/api/models/asset.model';

@Component({
  selector: 'lib-cms-asset-editor',
  imports: [MatButtonModule],
  templateUrl: './cms-asset-editor.component.html',
  styleUrl: './cms-asset-editor.component.scss',
})
export class CmsAssetEditorComponent {
  @Input() control: FormControl;
  @Input() label: string = 'image';

  constructor(
    private dialogService: DialogService,
    private assetService: AssetService,
  ) {}
  public openAssetDialog() {
    this.dialogService
      .openAssetPickerDialog()
      .afterClosed()
      .subscribe(response => {
        if (response.action === 'confirm' && response.data.asset) {
          const asset = response.data.asset as Asset;
          this.control.patchValue(asset.id);
        }
      });
  }

  generateThumbnailIdAssetUrl(id: string) {
    return `${this.assetService.baseUrl}/${id}/small`;
  }
}
