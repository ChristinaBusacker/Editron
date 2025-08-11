import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CmsColorEditorComponent } from '@cmsrenderer/cms-editor-renderer/cms-color-editor/cms-color-editor.component';
import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';
import { COLUMN_LAYOUTS } from 'libs/cmsmodules/src/modules/homepage/declarations/columnLayouts.constant';
import { ComponentInstance } from 'libs/cmsmodules/src/modules/homepage/declarations/component.declaration';

@Component({
  selector: 'app-homepage-editor-component-button-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    MatTabsModule,
    MatSelectModule,
    CmsColorEditorComponent,
  ],
  templateUrl: './homepage-editor-component-button-dialog.component.html',
  styleUrl: './homepage-editor-component-button-dialog.component.scss',
})
export class HomepageEditorComponentButtonDialogComponent implements OnInit {
  public data: { component: ComponentInstance; languages: string[] } =
    inject(MAT_DIALOG_DATA);
  private dialogRef = inject(
    MatDialogRef<HomepageEditorComponentButtonDialogComponent>,
  );

  layoutOptions = COLUMN_LAYOUTS;

  form = this.fb.group({});

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFormFromValues();
  }

  get localizable(): boolean {
    return this.data.component.localizable ?? false;
  }

  get languages(): string[] {
    return this.data.languages;
  }

  initFormFromValues(): void {
    this.form.addControl('id', new FormControl(this.data.component.id));
    const valueGroup = this.fb.group({});
    if (this.localizable) {
      const langGroup = this.fb.group({});
      const valueGroup = this.fb.group({});
      for (const lang of this.languages) {
        langGroup.addControl(
          lang,
          new FormControl(this.data.component.value?.[lang] ?? ''),
        );
      }
      valueGroup.addControl('color', new FormControl());
      valueGroup.addControl('text', langGroup);
      this.form.addControl('value', valueGroup);
    } else {
      this.form.addControl(
        'value',
        new FormControl(this.data.component.value ?? ''),
      );

      valueGroup.addControl('color', new FormControl());
      valueGroup.addControl('text', new FormControl());
      this.form.addControl('value', valueGroup);
    }
  }

  getControl(key): FormControl {
    const group = this.form.get('value');
    return group.get(key) as unknown as FormControl;
  }

  getControlInGroup(key: string, language: string): FormControl {
    return (this.form.get('value') as unknown as FormGroup)
      ?.get(key)
      .get(language) as FormControl;
  }

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
