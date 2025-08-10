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
import { CmsRichtextEditorComponent } from '@cmsrenderer/cms-editor-renderer/cms-richtext-editor/cms-richtext-editor.component';
import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';
import { COLUMN_LAYOUTS } from 'libs/cmsmodules/src/modules/homepage/declarations/columnLayouts.constant';
import { ComponentInstance } from 'libs/cmsmodules/src/modules/homepage/declarations/component.declaration';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-homepage-editor-component-text-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    MatTabsModule,
    MatSelectModule,
    QuillModule,
    CmsRichtextEditorComponent,
  ],
  templateUrl: './homepage-editor-component-text-dialog.component.html',
  styleUrl: './homepage-editor-component-text-dialog.component.scss',
})
export class HomepageEditorComponentTextDialogComponent implements OnInit {
  public data: { component: ComponentInstance; languages: string[] } =
    inject(MAT_DIALOG_DATA);
  private dialogRef = inject(
    MatDialogRef<HomepageEditorComponentTextDialogComponent>,
  );

  layoutOptions = COLUMN_LAYOUTS;

  control = new FormControl(this.data.component.id);
  form = this.fb.group({});
  modules: any;

  constructor(private fb: FormBuilder) {}

  get localizable(): boolean {
    return this.data.component.localizable ?? false;
  }

  get languages(): string[] {
    return this.data.languages;
  }

  ngOnInit(): void {
    this.initFormFromValues();
    this.modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'link'],
          ['blockquote', 'code-block'],

          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],

          [{ size: ['small', false, 'large', 'huge'] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ['clean'],
          ['cmsAsset'],
        ],
        handlers: {
          cmsAsset: () => this.onInsertAsset(),
        },
      },
    };
  }

  onEditorCreated(quill: any) {}

  onInsertAsset() {}

  initFormFromValues(): void {
    this.form.addControl('id', new FormControl(this.data.component.id));

    if (this.localizable) {
      const langGroup = this.fb.group({});
      for (const lang of this.languages) {
        langGroup.addControl(
          lang,
          new FormControl(this.data.component.value?.[lang] ?? ''),
        );
      }
      this.form.addControl('value', langGroup);
    } else {
      this.form.addControl(
        'value',
        new FormControl(this.data.component.value ?? ''),
      );
    }
  }

  getControl(): FormControl {
    return this.form.get('value') as unknown as FormControl;
  }

  getControlInGroup(language: string): FormControl {
    return (this.form.get('value') as unknown as FormGroup)?.get(
      language,
    ) as FormControl;
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
