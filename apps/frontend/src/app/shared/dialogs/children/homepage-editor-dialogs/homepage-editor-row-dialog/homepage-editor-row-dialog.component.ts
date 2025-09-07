import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { COLUMN_LAYOUTS } from '@editron/common/cmsmodules/src/modules/homepage/declarations/columnLayouts.constant';
import { Row } from '@editron/common/cmsmodules/src/modules/homepage/declarations/component.declaration';
import { ColumnLayout } from '@editron/common/cmsmodules/src/modules/homepage/declarations/styling.declaration';
import { generateCSSid } from '@frontend/core/utils/generate-css-id.util';
import { DialogComponent } from '@frontend/shared/dialogs/dialog.component';

@Component({
  selector: 'app-homepage-editor-row-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DialogComponent,
    MatTabsModule,
    MatSelectModule,
  ],
  templateUrl: './homepage-editor-row-dialog.component.html',
  styleUrl: './homepage-editor-row-dialog.component.scss',
})
export class HomepageEditorRowDialogComponent {
  public row: Row = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<HomepageEditorRowDialogComponent>);

  layoutOptions = COLUMN_LAYOUTS;

  form = this.fb.group(this.row);

  constructor(private fb: FormBuilder) {}

  getIterableforColumnLayout(layout: ColumnLayout) {
    return layout.cssGrid.split(' ');
  }

  getRowValue() {
    const value = this.form.value;
    const row: Row = {
      id: value.id,
      layout: value.layout,
      style: value.style,
      columns: [],
    };

    row.columns = value.layout.cssGrid.split(' ').map(col => {
      return {
        id: generateCSSid(),
        components: [],
        style: {},
      };
    });

    return row;
  }

  close(action: 'confirm' | 'cancel') {
    this.dialogRef.close({ action, row: this.getRowValue() });
  }
}
