import {
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CmsModuleState } from '@frontend/core/store/cmsModules/cmsModules.state';
import { buildValidatorsFromFieldDefinition } from '@frontend/core/utils/build-validators-from-field-definition.util';
import { deepEqual } from '@frontend/core/utils/deep-equal.util';
import { generateCSSid } from '@frontend/core/utils/generate-css-id.util';
import { DialogService } from '@frontend/shared/dialogs/dialog.service';
import { Project } from '@frontend/shared/services/api/models/project.model';
import { Store } from '@ngxs/store';
import {
  ContentSchemaDefinition,
  FieldDefinition,
} from '@shared/declarations/interfaces/content/content-schema-definition';
import { COLUMN_LAYOUTS } from 'libs/cmsmodules/src/modules/homepage/declarations/columnLayouts.constant';
import {
  Column,
  ComponentInstance,
  ComponentType,
  Row,
  Section,
} from 'libs/cmsmodules/src/modules/homepage/declarations/component.declaration';
import { map } from 'rxjs';
import { CmsFormFieldComponent } from '../cms-form-field/cms-form-field.component';

@Component({
  selector: 'lib-cms-homepage-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CmsFormFieldComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    DragDropModule,
  ],
  templateUrl: './cms-homepage-editor.component.html',
  styleUrl: './cms-homepage-editor.component.scss',
})
export class CmsHomepageEditorComponent implements OnInit {
  @Input({ required: true }) schemaDefinition!: ContentSchemaDefinition;
  @Input({ required: true }) project!: Project;
  @Input() values?: { [key: string]: any };
  @Input() form: FormGroup = this.fb.group({ content: new FormControl() });

  schemas = this.store.select(CmsModuleState.schemas);

  fields = signal<FieldDefinition[]>([]);

  sections: Section[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogService: DialogService,
  ) {}

  getAllColumnDropListIds(): string[] {
    return this.sections.flatMap(section =>
      section.rows.flatMap(row =>
        row.columns.map(column => 'column-' + column.id),
      ),
    );
  }

  getSectionDropListIds(): string[] {
    return this.sections.map(section => 'section-rows-' + section.id);
  }

  dropRow(event: any, section: Section) {
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    const prevContainer = event.previousContainer;
    const currContainer = event.container;
    if (prevContainer === currContainer) {
      moveItemInArray(section.rows, prevIndex, currIndex);
    } else {
      const sourceSection = this.sections.find(
        s => 'section-rows-' + s.id === prevContainer.id,
      );
      const targetSection = this.sections.find(
        s => 'section-rows-' + s.id === currContainer.id,
      );
      if (sourceSection && targetSection) {
        transferArrayItem(
          sourceSection.rows,
          targetSection.rows,
          prevIndex,
          currIndex,
        );
      }
    }
    this.updateFormControl();
  }

  dropSection(event: any) {
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    if (prevIndex !== currIndex) {
      moveItemInArray(this.sections, prevIndex, currIndex);
      this.updateFormControl();
    }
  }

  addSection() {
    const section: Section = { rows: [], id: generateCSSid(), style: {} };

    this.dialogService
      .openHomepageEditorSectionDialog(section)
      .afterClosed()
      .subscribe(data => {
        if (data.action === 'confirm') {
          this.sections.push(section);
          this.updateFormControl();
        }
      });
  }

  addRow(section: Section) {
    const newRow: Row = {
      columns: [],
      id: generateCSSid(),
      style: {},
      layout: COLUMN_LAYOUTS[0],
    };

    this.dialogService
      .openHomepageEditorRowDialog(newRow)
      .afterClosed()
      .subscribe(data => {
        if (data.action === 'confirm') {
          this.sections
            .find(s => s.id === section.id)
            ?.rows.push(data.row as Row);
          this.updateFormControl();
        }
      });
  }

  getColumnDropListIds(row: Row): string[] {
    return row.columns.map(c => 'column-' + c.id);
  }

  dropComponent(event: any, _row: Row) {
    const prevIndex = event.previousIndex;
    const currIndex = event.currentIndex;
    const prevContainer = event.previousContainer;
    const currContainer = event.container;
    if (prevContainer === currContainer) {
      const allColumns = this.sections.flatMap(section =>
        section.rows.flatMap(row => row.columns),
      );
      const column = allColumns.find(
        col => 'column-' + col.id === currContainer.id,
      );
      if (column) {
        moveItemInArray(column.components, prevIndex, currIndex);
      }
    } else {
      const allColumns = this.sections.flatMap(section =>
        section.rows.flatMap(row => row.columns),
      );
      const sourceColumn = allColumns.find(
        col => 'column-' + col.id === prevContainer.id,
      );
      const targetColumn = allColumns.find(
        col => 'column-' + col.id === currContainer.id,
      );
      if (sourceColumn && targetColumn) {
        transferArrayItem(
          sourceColumn.components,
          targetColumn.components,
          prevIndex,
          currIndex,
        );
      }
    }
    this.updateFormControl();
  }

  editRow(section: Section, affactedRow: Row) {
    this.editRowDialog(affactedRow).subscribe(row => {
      const length = section.rows.length;
      const idx = section.rows.findIndex(r => r.id === affactedRow.id);
      let updatedRows = [];
      for (let i = 0; i < length; i++) {
        if (i === idx) {
          updatedRows[i] = row;
        } else {
          updatedRows[i] = section.rows[i];
        }
      }

      const existingSection = this.sections.find(s => s.id === section.id);
      if (existingSection) {
        existingSection.rows = updatedRows;
      }
      this.updateFormControl();
    });
  }

  editRowDialog(row: Row) {
    return this.dialogService
      .openHomepageEditorRowDialog(row)
      .afterClosed()
      .pipe(
        map(data => {
          if (data.action === 'confirm') {
            return data.row as Row;
          }
          return row;
        }),
      );
  }

  initFormFromValues(values: Record<string, any>): void {
    const languages = this.project.settings.languages;
    for (const field of this.schemaDefinition.fields) {
      const validators = buildValidatorsFromFieldDefinition(field);
      const defaultValue =
        field.default ?? (field.type === 'boolean' ? false : null);

      if (field.type === 'content') {
        const value = values[field.name];
        this.form.addControl(field.name, new FormControl(value || []));
        this.sections = value || [];
      } else if (field.localizable) {
        const langGroup = this.fb.group({});
        for (const lang of languages) {
          const value = values?.[field.name]?.[lang] ?? defaultValue;
          langGroup.addControl(lang, new FormControl(value, validators));
        }
        this.form.addControl(field.name, langGroup);
      } else {
        const value = values?.[field.name] ?? defaultValue;
        this.form.addControl(field.name, new FormControl(value, validators));
      }
    }
  }

  updateFormControl() {
    this.form.get('content').patchValue(this.sections);
  }

  getValuesFromFormGroup(): Record<string, any> {
    const result: Record<string, any> = {};
    const languages = this.project.settings.languages;

    for (const field of this.schemaDefinition.fields) {
      const control = this.form.get(field.name);
      if (!control) continue;

      if (field.type === 'content') {
        result[field.name] = control.value;
      } else if (field.localizable) {
        const langGroup = control as FormGroup;
        result[field.name] = {};
        for (const lang of languages) {
          result[field.name][lang] = langGroup.get(lang)?.value;
        }
      } else {
        result[field.name] = control.value;
      }
    }

    return result;
  }

  deleteRow(row: Row, section: Section) {
    const sec = this.sections.find(s => s.id === section.id);
    sec.rows = sec.rows.filter(r => r.id !== row.id);
    this.updateFormControl();
  }

  deleteSection(section: Section) {
    this.sections = this.sections.filter(s => s.id !== section.id);
    this.updateFormControl();
  }

  ngOnInit(): void {
    this.fields.set(this.schemaDefinition.fields);
    this.form.valueChanges.subscribe(() => {
      console.log(this.form.value);
    });
    this.initFormFromValues(this.values ?? {});
  }

  hasUnsavedChanges(): boolean {
    const formValue = this.getValuesFromFormGroup();
    debugger;
    return !deepEqual(formValue, this.values);
  }

  addComponentToColumn(column: Column, type: ComponentType) {
    const component: ComponentInstance = {
      id: generateCSSid(8),
      type,
      value: null,
      settings: {},
      localizable:
        this.fields().find(f => f.type === 'content').localizable ?? false,
    };

    this.dialogService
      .openHomepageEditorComponentDialog({
        component,
        languages: this.project.settings.languages,
      })
      .afterClosed()
      .subscribe(data => {
        if (data.action === 'confirm') {
          column.components.push(data.component);
          this.updateFormControl();
        }
      });
  }

  editComponent(
    section: Section,
    row: Row,
    column: Column,
    component: ComponentInstance,
  ) {
    this.dialogService
      .openHomepageEditorComponentDialog({
        component,
        languages: this.project.settings.languages,
      })
      .afterClosed()
      .subscribe(data => {
        if (data.action === 'confirm') {
          const affectedColumn = this.sections
            .find(s => s.id === section.id)
            ?.rows.find(r => r.id === row.id)
            ?.columns.find(c => c.id === column.id);

          if (affectedColumn) {
            affectedColumn.components = affectedColumn.components.map(comp => {
              if (comp.id !== component.id) {
                return comp;
              } else {
                return data.component;
              }
            });
          }
        }
      });
  }

  deleteComponent(
    section: Section,
    row: Row,
    column: Column,
    component: ComponentInstance,
  ) {
    const affectedColumn = this.sections
      .find(s => s.id === section.id)
      ?.rows.find(r => r.id === row.id)
      ?.columns.find(c => c.id === column.id);

    affectedColumn.components = affectedColumn.components.filter(
      c => c.id !== component.id,
    );
  }
}
