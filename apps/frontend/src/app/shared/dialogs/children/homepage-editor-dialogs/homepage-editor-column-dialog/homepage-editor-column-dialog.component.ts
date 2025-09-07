import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { COLUMN_LAYOUTS } from '@editron/common/cmsmodules/src/modules/homepage/declarations/columnLayouts.constant';
import { ConfirmDialogData } from '@frontend/core/declarations/interfaces/dialog.interfaces';
import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';

@Component({
  selector: 'app-homepage-editor-column-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    MatTabsModule,
    MatSelectModule,
  ],
  templateUrl: './homepage-editor-column-dialog.component.html',
  styleUrl: './homepage-editor-column-dialog.component.scss',
})
export class HomepageEditorColumnDialogComponent {
  public row: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<HomepageEditorColumnDialogComponent>);

  layoutOptions = COLUMN_LAYOUTS;

  form = this.fb.group(this.row);

  constructor(private fb: FormBuilder) {}

  close(action: 'confirm' | 'cancel') {
    this.dialogRef.close({ action });
  }
}
