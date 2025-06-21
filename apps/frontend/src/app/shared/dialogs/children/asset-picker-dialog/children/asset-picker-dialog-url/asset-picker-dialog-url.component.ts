import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { AssetService } from '@frontend/shared/services/api/asset.service';
import { UploadAssetResponse } from '@frontend/shared/services/api/models/asset.model';
import { debounceTime, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-asset-picker-dialog-url',
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, CommonModule],
  templateUrl: './asset-picker-dialog-url.component.html',
  styleUrl: './asset-picker-dialog-url.component.scss',
})
export class AssetPickerDialogUrlComponent implements OnInit {
  control = new FormControl();
  previewUrl: string;
  isUploading = false;
  isValidUrl = false;
  mimeType = '';
  filename = '';

  @Output() fileUploaded = new EventEmitter<UploadAssetResponse>();

  constructor(private assetService: AssetService) {}

  uploadFile() {
    if (!this.isValidUrl) return;
    this.isUploading = true;
    this.assetService
      .uploadFromData({
        filename: this.filename,
        mimeType: this.mimeType,
        url: this.control.value,
      })
      .subscribe(response => {
        this.isUploading = false;
        this.fileUploaded.emit(response);
      });
  }

  async validateAndExtractFromUrl(url: string): Promise<{
    isValid: boolean;
    filename: string;
    mimeType: string;
  }> {
    try {
      const response = await lastValueFrom(
        this.assetService.detectMimeTypeFromUrl(url),
      );
      this.mimeType = response;

      const allowedTypes = ['image/', 'video/'];

      const isValid = allowedTypes.some(type => response.startsWith(type));
      if (!isValid) return { isValid: false, filename: '', mimeType: '' };
      // Extract filename from URL
      const urlParts = new URL(url).pathname.split('/');
      let filename = urlParts[urlParts.length - 1];
      if (!filename.includes('.')) {
        const extension = response.split('/')[1];
        filename = `downloaded.${extension}`;
      }

      return { isValid, filename, mimeType: response };
    } catch (err) {
      return { isValid: false, filename: '', mimeType: '' };
    }
  }

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(debounceTime(2000))
      .subscribe(async value => {
        this.previewUrl = value;

        const result = await this.validateAndExtractFromUrl(value);
        this.isValidUrl = result.isValid;
        this.mimeType = result.mimeType;
        this.filename = result.filename;
      });
  }
}
