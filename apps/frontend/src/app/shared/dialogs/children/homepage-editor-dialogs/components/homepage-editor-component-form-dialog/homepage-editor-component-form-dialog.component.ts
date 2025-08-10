import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';
import { COLUMN_LAYOUTS } from 'libs/cmsmodules/src/modules/homepage/declarations/columnLayouts.constant';
import { ComponentInstance } from 'libs/cmsmodules/src/modules/homepage/declarations/component.declaration';

@Component({
  selector: 'app-homepage-editor-component-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    MatTabsModule,
    MatSelectModule,
  ],
  templateUrl: './homepage-editor-component-form-dialog.component.html',
  styleUrl: './homepage-editor-component-form-dialog.component.scss',
})
export class HomepageEditorComponentFormDialogComponent implements OnInit {
  public component: ComponentInstance = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(
    MatDialogRef<HomepageEditorComponentFormDialogComponent>,
  );

  layoutOptions = COLUMN_LAYOUTS;

  form = this.fb.group(this.component);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.component);
  }

  close(action: 'confirm' | 'cancel') {
    this.dialogRef.close({ action });
  }
}
