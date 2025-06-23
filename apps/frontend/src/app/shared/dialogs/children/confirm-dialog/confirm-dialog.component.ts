import { Component, inject } from '@angular/core';
import { DialogComponent } from '../../dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '@frontend/core/declarations/interfaces/dialog.interfaces';

@Component({
  selector: 'app-confirm-dialog',
  imports: [DialogComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  public dialogData: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  close(action: 'confirm' | 'cancel') {
    this.dialogRef.close({ action });
  }
}
