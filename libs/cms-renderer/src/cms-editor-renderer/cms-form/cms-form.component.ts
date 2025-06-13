import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import {
  ContentSchemaDefinition,
  FieldDefinition,
} from '@shared/declarations/interfaces/content/content-schema-definition';
import { CmsRichtextEditorComponent } from '../cms-richtext-editor/cms-richtext-editor.component';
import { CmsGeolocationEditorComponent } from '../cms-geolocation-editor/cms-geolocation-editor.component';
import { CmsDatetimeEditorComponent } from '../cms-datetime-editor/cms-datetime-editor.component';
import { CmsHtmlEditorComponent } from '../cms-html-editor/cms-html-editor.component';
import { CmsColorEditorComponent } from '../cms-color-editor/cms-color-editor.component';
import { CmsTagEditorComponent } from '../cms-tag-editor/cms-tag-editor.component';
import { CmsJsonEditorComponent } from '../cms-json-editor/cms-json-editor.component';

@Component({
  selector: 'lib-cms-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CmsRichtextEditorComponent,
    CmsGeolocationEditorComponent,
    CmsDatetimeEditorComponent,
    CmsHtmlEditorComponent,
    CmsColorEditorComponent,
    CmsJsonEditorComponent,
    CmsTagEditorComponent,
  ],
  templateUrl: './cms-form.component.html',
})
export class CmsFormComponent implements OnInit {
  @Input({ required: true }) schemaDefinition!: ContentSchemaDefinition;
  @Input() form: FormGroup = this.fb.group({});
  fields = signal<FieldDefinition[]>([]);

  constructor(private fb: FormBuilder) {}

  private buildValidators(field: FieldDefinition) {
    const v = field.validation ?? {};
    const validators = [];

    if (v.required) {
      validators.push(Validators.required);
    }

    if (typeof v.minLength === 'number') {
      validators.push(Validators.minLength(v.minLength));
    }

    if (typeof v.maxLength === 'number') {
      validators.push(Validators.maxLength(v.maxLength));
    }

    if (typeof v.min === 'number') {
      validators.push(Validators.min(v.min));
    }

    if (typeof v.max === 'number') {
      validators.push(Validators.max(v.max));
    }

    if (v.pattern) {
      validators.push(Validators.pattern(v.pattern));
    }

    // Sonderfall Slug
    if (field.type === 'slug') {
      validators.push(Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
    }

    return validators;
  }

  getErrors(fieldName: string): string[] {
    const control = this.getControl(fieldName);
    if (!control || !control.touched || control.valid) return [];

    const errors: string[] = [];
    const errorMap = control.errors ?? {};

    if (errorMap['required']) errors.push('This field is required.');
    if (errorMap['minlength'])
      errors.push(
        `Minimum ${errorMap['minlength'].requiredLength} characters required.`,
      );
    if (errorMap['maxlength'])
      errors.push(
        `Maximum ${errorMap['maxlength'].requiredLength} characters allowed.`,
      );
    if (errorMap['pattern']) errors.push('Invalid format.');

    return errors;
  }

  ngOnInit(): void {
    if (!this.schemaDefinition) {
      return;
    }
    this.fields.set(this.schemaDefinition.fields);

    for (const field of this.fields()) {
      const validators = this.buildValidators(field);

      // Setting global defaults
      let defaultValue = null;
      if (field.type === 'boolean') {
        defaultValue = false;
      }

      // overwrite with explicit defaults
      defaultValue = field.default || defaultValue;

      this.form.addControl(
        field.name,
        new FormControl(defaultValue, validators),
      );
    }
  }

  getControl(name: string) {
    return this.form.get(name) as FormControl;
  }

  onSlugInput(fieldName: string) {
    const control = this.getControl(fieldName);
    const value = control.value ?? '';

    const slug = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    control.setValue(slug, { emitEvent: false });
  }
}
