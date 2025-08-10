import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogData } from '@frontend/core/declarations/interfaces/dialog.interfaces';
import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';
import { Section } from 'libs/cmsmodules/src/modules/homepage/declarations/component.declaration';
import { MatTabsModule } from '@angular/material/tabs';

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
export class HomepageEditorSectionDialogComponent implements OnInit {
  public section: Section = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(
    MatDialogRef<HomepageEditorSectionDialogComponent>,
  );

  form = this.fb.group(this.section);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  close(action: 'confirm' | 'cancel') {
    this.dialogRef.close({ action });
  }
}
