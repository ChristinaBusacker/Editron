import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from './children/create-project-dialog/create-project-dialog.component';
import { AssetPickerDialogComponent } from './children/asset-picker-dialog/asset-picker-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly matDialog: MatDialog) {}

  openCreateProjectDialog() {
    return this.matDialog.open(CreateProjectDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
    });
  }

  openAssetPickerDialog() {
    return this.matDialog.open(AssetPickerDialogComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
    });
  }
}
