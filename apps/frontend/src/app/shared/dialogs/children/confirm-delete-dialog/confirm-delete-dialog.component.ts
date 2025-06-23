import { Component, inject, OnInit } from '@angular/core';
import { DialogComponent } from '../../dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogData } from '@frontend/core/declarations/interfaces/dialog.interfaces';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-confirm-delete-dialog',
  imports: [
    DialogComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrl: './confirm-delete-dialog.component.scss',
})
export class ConfirmDeleteDialogComponent implements OnInit {
  public dialogData: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDeleteDialogComponent>);

  public formControl = new FormControl();
  public isConfirmed = false;

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(value => {
      this.isConfirmed = value === 'DELETE';
    });
  }

  close(action: 'confirm' | 'cancel') {
    if (action === 'confirm' && !this.isConfirmed) {
      return;
    }
    this.dialogRef.close({ action });
  }
}
