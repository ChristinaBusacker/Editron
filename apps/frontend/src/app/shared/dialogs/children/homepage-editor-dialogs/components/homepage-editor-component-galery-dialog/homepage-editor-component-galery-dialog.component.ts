import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { CmsAssetEditorComponent } from '@editron/client/cms-renderer/src/cms-editor-renderer/cms-asset-editor/cms-asset-editor.component';
import { COLUMN_LAYOUTS } from '@editron/common/cmsmodules/src/modules/homepage/declarations/columnLayouts.constant';
import { ComponentInstance } from '@editron/common/cmsmodules/src/modules/homepage/declarations/component.declaration';
import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';

@Component({
  selector: 'app-homepage-editor-component-galery-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
    CmsAssetEditorComponent,
  ],
  templateUrl: './homepage-editor-component-galery-dialog.component.html',
  styleUrl: './homepage-editor-component-galery-dialog.component.scss',
})
export class HomepageEditorComponentGaleryDialogComponent implements OnInit {
  public data: { component: ComponentInstance; languages: string[] } =
    inject(MAT_DIALOG_DATA);
  private dialogRef = inject(
    MatDialogRef<HomepageEditorComponentGaleryDialogComponent>,
  );

  layoutOptions = COLUMN_LAYOUTS;

  form = this.fb.group({});
  disableLocalizationControl = new FormControl(true);
  disbleLocalization = true;

  get localizable(): boolean {
    return this.data.component.localizable ?? false;
  }

  get languages(): string[] {
    return this.data.languages;
  }

  constructor(private fb: FormBuilder) {}

  initFormFromValues(): void {
    this.form.addControl('id', new FormControl(this.data.component.id));

    const valueGroup = this.fb.group({});
    valueGroup.addControl(
      'disableLocalization',
      this.disableLocalizationControl,
    );
    if (this.localizable) {
      const imgGroup = this.fb.group({});
      const altGroup = this.fb.group({});
      const titleGroup = this.fb.group({});
      for (const lang of this.languages) {
        imgGroup.addControl(
          lang,
          new FormControl(this.data.component.value?.img[lang] ?? ''),
        );

        altGroup.addControl(
          lang,
          new FormControl(this.data.component.value?.alt[lang] ?? ''),
        );

        titleGroup.addControl(
          lang,
          new FormControl(this.data.component.value?.title[lang] ?? ''),
        );
      }

      valueGroup.addControl('img', imgGroup);
      valueGroup.addControl('alt', altGroup);
      valueGroup.addControl('title', titleGroup);
      this.form.addControl('value', valueGroup);
    } else {
      const valueGroup = this.fb.group({});
      valueGroup.addControl(
        'img',
        new FormControl(this.data.component.value.src ?? ''),
      );
      this.form.addControl('value', valueGroup);
    }
  }

  getControlInGroup(key: string, language: string): FormControl {
    const valueGrp = this.form.get('value');
    const targetGrp = valueGrp.get(key);

    if (this.localizable) {
      return targetGrp.get(language) as unknown as FormControl;
    }
    return targetGrp as unknown as FormControl;
  }

  getControl(key: string): FormControl {
    return this.form.get('value').get(key) as unknown as FormControl;
  }

  ngOnInit(): void {
    this.disableLocalizationControl.valueChanges.subscribe(
      value => (this.disbleLocalization = value),
    );
    this.initFormFromValues();
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
