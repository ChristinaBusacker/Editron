import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CmsFormFieldComponent } from '../cms-form-field/cms-form-field.component';
import {
  ContentSchemaDefinition,
  FieldDefinition,
} from '@shared/declarations/interfaces/content/content-schema-definition';
import { Project } from '@frontend/shared/services/api/models/project.model';

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

    const languages = this.project.settings.languages;

    for (const field of this.fields()) {
      const validators = this.buildValidators(field);
      let defaultValue =
        field.default ?? (field.type === 'boolean' ? false : null);

      if (field.localizable) {
        const langGroup = this.fb.group({});
        for (const lang of languages) {
          langGroup.addControl(lang, new FormControl(defaultValue, validators));

          if (this.values) {
            langGroup.get(lang).patchValue(this.values[field.name][lang], {
              emit: false,
            });
          }
        }

        this.form.addControl(field.name, langGroup);
      } else {
        this.form.addControl(
          field.name,
          new FormControl(defaultValue, validators),
        );

        if (this.values) {
          this.form.get(field.name).patchValue(this.values[field.name]);
        }
      }
    }

    console.log(this.form);
  }

  private buildValidators(field: FieldDefinition) {
    const v = field.validation ?? {};
    const validators = [];

    if (v.required) validators.push(Validators.required);
    if (typeof v.minLength === 'number')
      validators.push(Validators.minLength(v.minLength));
    if (typeof v.maxLength === 'number')
      validators.push(Validators.maxLength(v.maxLength));
    if (typeof v.min === 'number') validators.push(Validators.min(v.min));
    if (typeof v.max === 'number') validators.push(Validators.max(v.max));
    if (v.pattern) validators.push(Validators.pattern(v.pattern));

    if (field.type === 'slug') {
      validators.push(Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
    }

    return validators;
  }
}
