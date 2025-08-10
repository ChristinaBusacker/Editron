import { Validators } from '@angular/forms';
import { FieldDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export function buildValidatorsFromFieldDefinition(field: FieldDefinition) {
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
