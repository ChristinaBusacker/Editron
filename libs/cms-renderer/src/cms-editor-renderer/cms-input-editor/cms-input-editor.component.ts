import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'lib-cms-input-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './cms-input-editor.component.html',
})
export class CmsInputEditorComponent {
  @Input({ required: true }) control!: FormControl;
  @Input() label: string = '';
  @Input() type: 'text' | 'textarea' | 'slug' | 'number' | 'select' | 'date' =
    'text';
  @Input() step?: string | number;
  @Input() options: string[] = [];

  getErrors(): string[] {
    if (!this.control || !this.control.touched || this.control.valid) return [];
    const errorMap = this.control.errors ?? {};
    const errors: string[] = [];

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
    if (errorMap['min']) errors.push(`Value must be ≥ ${errorMap['min'].min}`);
    if (errorMap['max']) errors.push(`Value must be ≤ ${errorMap['max'].max}`);

    return errors;
  }

  slugify(control: FormControl) {
    const value = control.value ?? '';
    const slug = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\\s-]/g, '')
      .trim()
      .replace(/\\s+/g, '-')
      .replace(/-+/g, '-');

    control.setValue(slug, { emitEvent: false });
  }
}
