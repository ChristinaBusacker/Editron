import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
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
  @Input() multiSelect: boolean = false;
  @Input() lastValue: string | string[];
  @Input() selectedAssets: Asset[] = [];
  @Input() selectedAsset: Asset;

  @Output() onAssetSelect = new EventEmitter<Asset>();

  constructor(private assetService: AssetService) {}

  generateThumbnailIdAssetUrl(id: string) {
    return `${this.assetService.baseUrl}/${id}/small`;
  }

  selectAsset(asset: Asset) {
    this.onAssetSelect.emit(asset);
  }

  isAssetSelected(asset: Asset): boolean {
    return this.multiSelect
      ? this.selectedAssets.some(a => a.id === asset.id)
      : this.selectedAsset?.id === asset.id;
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
      if (this.multiSelect) {
        (this.lastValue as string[]).forEach(id => {
          const asset = assets.find(a => a.id === id);
          this.selectedAssets.push(asset);
        });
      } else {
        const id = this.lastValue as string;
        const asset = assets.find(a => a.id === id);
        this.selectedAsset = asset;
      }
    });
  }
}
