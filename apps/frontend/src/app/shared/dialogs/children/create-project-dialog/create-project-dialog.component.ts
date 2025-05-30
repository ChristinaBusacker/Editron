import { Component, inject } from '@angular/core';
import { DialogComponent } from '../../dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-project-dialog',
  imports: [DialogComponent],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.scss',
})
export class CreateProjectDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateProjectDialogComponent>);

  close(action: string) {
    this.dialogRef.close({ action, data: {} });
  }
}
