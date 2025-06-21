import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { DropZoneDirective } from '@frontend/core/directives/drop-zone.directive';
import { AssetService } from '@frontend/shared/services/api/asset.service';
import {
  Asset,
  UploadAssetResponse,
} from '@frontend/shared/services/api/models/asset.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { concatMap, from, tap } from 'rxjs';

@Component({
  selector: 'app-asset-picker-dialog-selection',
  imports: [DropZoneDirective, MatProgressBarModule],
  providers: [AssetService],
  templateUrl: './asset-picker-dialog-selection.component.html',
  styleUrl: './asset-picker-dialog-selection.component.scss',
})
export class AssetPickerDialogSelectionComponent implements OnInit {
  assets: Array<Asset | UploadAssetResponse>;
  isHovering = false;
  isUploading = false;
  uploadingProgress = 0;
  selectedAsset: Asset;

  @Output() onAssetSelect = new EventEmitter<Asset>();

  constructor(private assetService: AssetService) {}

  generateThumbnailIdAssetUrl(id: string) {
    return `${this.assetService.baseUrl}/${id}/small`;
  }

  selectAsset(asset: Asset) {
    this.selectedAsset = asset;
    this.onAssetSelect.emit(asset);
  }

  async handleDrop(droppedFiles: File[]) {
    from(droppedFiles)
      .pipe(
        concatMap(file =>
          this.assetService.uploadAsset(file).pipe(
            tap(progressOrResponse => {
              this.isUploading = true;
              if (typeof progressOrResponse === 'number') {
                console.log(`Uploading ${file.name}: ${progressOrResponse}%`);
                this.uploadingProgress = progressOrResponse;
              } else {
                console.log(`Upload complete:`, progressOrResponse);
                this.assets = [progressOrResponse, ...this.assets];
                this.isUploading = false;
              }
            }),
          ),
        ),
      )
      .subscribe({
        complete: () => console.log('All uploads done!'),
        error: err => console.error('Upload error:', err),
      });
  }

  async ngOnInit(): Promise<void> {
    this.assetService.listAssets().subscribe(assets => {
      this.assets = assets;
    });
  }
}
