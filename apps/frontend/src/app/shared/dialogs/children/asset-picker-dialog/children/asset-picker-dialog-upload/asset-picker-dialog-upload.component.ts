import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AssetService } from '@frontend/shared/services/api/asset.service';
import { UploadAssetResponse } from '@frontend/shared/services/api/models/asset.model';

import { from, concatMap, tap, filter, map } from 'rxjs';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-asset-picker-dialog-upload',
  standalone: true,
  imports: [MatProgressBarModule, MatButtonModule],
  templateUrl: './asset-picker-dialog-upload.component.html',
  styleUrl: './asset-picker-dialog-upload.component.scss',
})
export class AssetPickerDialogUploadComponent {
  isHovering = false;
  isUploading = false;
  uploadingProgress = 0;

  @Output() fileUploaded = new EventEmitter<UploadAssetResponse>();

  constructor(private assetService: AssetService) {}

  async handleDrop(droppedFiles: File[]) {
    this.uploadFiles(droppedFiles);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length > 0) {
      this.uploadFiles(files);
      input.value = '';
    }
  }

  private uploadFiles(files: File[]) {
    this.isUploading = true;

    from(files)
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
                this.isUploading = false;
                this.fileUploaded.emit(
                  progressOrResponse as UploadAssetResponse,
                );
              }
            }),
          ),
        ),
      )
      .subscribe({
        complete: () => {
          this.isUploading = false;
          console.log('All uploads done!');
        },
        error: err => {
          this.isUploading = false;
          console.error('Upload error:', err);
        },
      });
  }
}
