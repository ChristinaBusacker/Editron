import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { deepEqual } from '@frontend/core/utils/deep-equal.util';
import { Project } from '@frontend/shared/services/api/models/project.model';
import {
  ContentSchemaDefinition,
  FieldDefinition,
} from '@shared/declarations/interfaces/content/content-schema-definition';
import { CmsFormFieldComponent } from '../cms-form-field/cms-form-field.component';
import { buildValidatorsFromFieldDefinition } from '@frontend/core/utils/build-validators-from-field-definition.util';

@Component({
  selector: 'lib-cms-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CmsFormFieldComponent],
  templateUrl: './cms-form.component.html',
})
export class CmsFormComponent implements OnInit {
  @Input({ required: true }) schemaDefinition!: ContentSchemaDefinition;
  @Input({ required: true }) project!: Project;
  @Input() form: FormGroup = this.fb.group({});
  @Input() values?: { [key: string]: any };

  fields = signal<FieldDefinition[]>([]);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.schemaDefinition) return;
    this.fields.set(this.schemaDefinition.fields);
    this.initFormFromValues(this.values ?? {});
  }

  initFormFromValues(values: Record<string, any>): void {
    const languages = this.project.settings.languages;

    for (const field of this.fields()) {
      const validators = buildValidatorsFromFieldDefinition(field);
      const defaultValue =
        field.default ?? (field.type === 'boolean' ? false : null);

      if (field.localizable) {
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

  getValuesFromFormGroup(): Record<string, any> {
    const result: Record<string, any> = {};
    const languages = this.project.settings.languages;

    for (const field of this.fields()) {
      const control = this.form.get(field.name);
      if (!control) continue;

      if (field.localizable) {
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

  hasUnsavedChanges(): boolean {
    return !deepEqual(this.getValuesFromFormGroup(), this.values);
  }
}
