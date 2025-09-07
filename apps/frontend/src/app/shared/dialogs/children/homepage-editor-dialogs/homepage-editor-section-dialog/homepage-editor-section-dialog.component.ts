import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';

import { MatTabsModule } from '@angular/material/tabs';
import { Section } from '@editron/common/cmsmodules/src/modules/homepage/declarations/component.declaration';

@Component({
  selector: 'app-homepage-editor-section-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    MatTabsModule,
  ],
  templateUrl: './homepage-editor-section-dialog.component.html',
  styleUrl: './homepage-editor-section-dialog.component.scss',
})
export class HomepageEditorSectionDialogComponent {
  public section: Section = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(
    MatDialogRef<HomepageEditorSectionDialogComponent>,
  );

  form = this.fb.group(this.section);

  constructor(private fb: FormBuilder) {}

  close(action: 'confirm' | 'cancel') {
    this.dialogRef.close({ action });
  }
}
