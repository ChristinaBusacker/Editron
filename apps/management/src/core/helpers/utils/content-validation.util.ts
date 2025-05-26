import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export function validateContentValues(
  schema: ContentSchemaDefinition,
  values: Record<string, any>,
  locale?: string,
): string[] {
  const errors: string[] = [];

  for (const field of schema.fields) {
    const fieldKey = field.name;
    const value = values[fieldKey];

    const isMissing = value === undefined || value === null || value === '';
    const isLocalized = field.localizable && locale;

    // Required check
    if (field.validation?.required && isMissing) {
      errors.push(
        `Field "${fieldKey}" is required${isLocalized ? ` (${locale})` : ''}`,
      );
      continue;
    }

    if (isMissing) continue; // skip further validation if value is missing

    // Type-specific validations
    switch (field.type) {
      case 'singleline':
      case 'multiline':
      case 'html':
      case 'richtext':
      case 'slug':
        if (typeof value !== 'string') {
          errors.push(`Field "${fieldKey}" must be a string`);
        } else {
          if (
            field.validation?.minLength &&
            value.length < field.validation.minLength
          ) {
            errors.push(`Field "${fieldKey}" is too short`);
          }
          if (
            field.validation?.maxLength &&
            value.length > field.validation.maxLength
          ) {
            errors.push(`Field "${fieldKey}" is too long`);
          }
          if (field.validation?.pattern) {
            const re = new RegExp(field.validation.pattern);
            if (!re.test(value)) {
              errors.push(`Field "${fieldKey}" does not match pattern`);
            }
          }
        }
        break;

      case 'number':
      case 'float':
        if (typeof value !== 'number') {
          errors.push(`Field "${fieldKey}" must be a number`);
        } else {
          if (
            field.validation?.min !== undefined &&
            value < field.validation.min
          ) {
            errors.push(
              `Field "${fieldKey}" must be >= ${field.validation.min}`,
            );
          }
          if (
            field.validation?.max !== undefined &&
            value > field.validation.max
          ) {
            errors.push(
              `Field "${fieldKey}" must be <= ${field.validation.max}`,
            );
          }
        }
        break;

      case 'date':
      case 'datetime':
        if (typeof value !== 'string' || isNaN(Date.parse(value))) {
          errors.push(`Field "${fieldKey}" must be a valid ISO date string`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Field "${fieldKey}" must be a boolean`);
        }
        break;

      case 'color':
        if (
          typeof value !== 'string' ||
          !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)
        ) {
          errors.push(`Field "${fieldKey}" must be a valid color hex`);
        }
        break;

      case 'select':
        if (!field.options?.includes(value)) {
          errors.push(
            `Field "${fieldKey}" must be one of: ${field.options?.join(', ')}`,
          );
        }
        break;

      case 'tags':
        if (
          !Array.isArray(value) ||
          !value.every((v) => typeof v === 'string')
        ) {
          errors.push(`Field "${fieldKey}" must be an array of strings`);
        }
        break;

      case 'json':
        if (typeof value !== 'object') {
          errors.push(`Field "${fieldKey}" must be a JSON object`);
        }
        break;

      case 'geolocation':
        if (
          typeof value !== 'object' ||
          typeof value.lat !== 'number' ||
          typeof value.lng !== 'number'
        ) {
          errors.push(`Field "${fieldKey}" must contain lat/lng`);
        }
        break;

      case 'relation':
      case 'asset':
        if (field.relation?.multiple) {
          if (!Array.isArray(value) || !value.every((v) => v && v.entryId)) {
            errors.push(`Field "${fieldKey}" must be an array of relations`);
          }
        } else {
          if (typeof value !== 'object' || !value.entryId) {
            errors.push(
              `Field "${fieldKey}" must be a relation object with entryId`,
            );
          }
        }
        break;

      default:
        errors.push(`Unknown field type: ${field.type}`);
    }
  }

  return errors;
}
