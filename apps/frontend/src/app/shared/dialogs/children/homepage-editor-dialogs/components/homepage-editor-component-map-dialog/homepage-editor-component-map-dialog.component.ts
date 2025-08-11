import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CmsGeolocationEditorComponent } from '@cmsrenderer/cms-editor-renderer/cms-geolocation-editor/cms-geolocation-editor.component';
import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';
import { COLUMN_LAYOUTS } from 'libs/cmsmodules/src/modules/homepage/declarations/columnLayouts.constant';
import { ComponentInstance } from 'libs/cmsmodules/src/modules/homepage/declarations/component.declaration';

@Component({
  selector: 'app-homepage-editor-component-map-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    MatTabsModule,
    MatSelectModule,
    CmsGeolocationEditorComponent,
  ],
  templateUrl: './homepage-editor-component-map-dialog.component.html',
  styleUrl: './homepage-editor-component-map-dialog.component.scss',
})
export class HomepageEditorComponentMapDialogComponent implements OnInit {
  public data: { component: ComponentInstance; languages: string[] } =
    inject(MAT_DIALOG_DATA);
  private dialogRef = inject(
    MatDialogRef<HomepageEditorComponentMapDialogComponent>,
  );

  layoutOptions = COLUMN_LAYOUTS;

  form = this.fb.group({
    value: new FormControl(this.data.component.value),
    id: new FormControl(this.data.component.id),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  close(action: 'confirm' | 'cancel') {
    if (action === 'confirm') {
      this.dialogRef.close({
        action,
        component: {
          ...this.data.component,
          ...this.form.value,
        },
      });
    } else {
      this.dialogRef.close({ action });
    }
  }
}
