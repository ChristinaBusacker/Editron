import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from './children/create-project-dialog/create-project-dialog.component';
import { AssetPickerDialogComponent } from './children/asset-picker-dialog/asset-picker-dialog.component';
import {
  ConfirmDialogData,
  RelationPickerDialogData,
} from '@frontend/core/declarations/interfaces/dialog.interfaces';
import { ConfirmDialogComponent } from './children/confirm-dialog/confirm-dialog.component';
import { ConfirmDeleteDialogComponent } from './children/confirm-delete-dialog/confirm-delete-dialog.component';
import { RelationPickerComponent } from './children/relation-picker-dialog/relation-picker-dialog.component';

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

  openRelationPickerDialog(data: RelationPickerDialogData) {
    return this.matDialog.open(RelationPickerComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openConfirmDialog(data: ConfirmDialogData) {
    return this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }

  openConfirmDeleteDialog(data: ConfirmDialogData) {
    return this.matDialog.open(ConfirmDeleteDialogComponent, {
      maxWidth: '400px',
      maxHeight: '90vh',
      width: '100%',
      ariaLabelledBy: 'dialog-title',
      data,
    });
  }
}
