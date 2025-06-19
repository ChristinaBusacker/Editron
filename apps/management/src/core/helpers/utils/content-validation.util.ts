import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export function validateContentValues(
  schema: ContentSchemaDefinition,
  values: Record<string, any>,
  locale?: string, // optional: wenn nur eine Sprache geprüft werden soll
): string[] {
  const errors: string[] = [];

  for (const field of schema.fields) {
    const fieldKey = field.name;
    const value = values[fieldKey];

    // Prüfe Lokalisierung
    const isLocalized = field.localizable;

    // validiere je Sprache bei lokalisierbaren Feldern
    if (isLocalized) {
      if (typeof value !== 'object' || value === null) {
        errors.push(`Field "${fieldKey}" must be a localized object`);
        continue;
      }

      const localesToCheck = locale ? [locale] : Object.keys(value);
      for (const lang of localesToCheck) {
        const langValue = value[lang];
        const langErrors = validateSingleField(field, langValue, lang);
        errors.push(
          ...langErrors.map((e) => `Field "${fieldKey}" ${e} (${lang})`),
        );
      }
    } else {
      const fieldErrors = validateSingleField(field, value);
      errors.push(...fieldErrors.map((e) => `Field "${fieldKey}" ${e}`));
    }
  }

  return errors;
}

function validateSingleField(
  field: ContentSchemaDefinition['fields'][0],
  value: any,
  lang?: string,
): string[] {
  const errors: string[] = [];

  const isMissing = value === undefined || value === null || value === '';

  if (field.validation?.required && isMissing) {
    errors.push('is required');
    return errors;
  }

  if (isMissing) return []; // Skip further validation

  switch (field.type) {
    case 'singleline':
    case 'multiline':
    case 'html':
    case 'richtext':
    case 'slug':
      if (typeof value !== 'string') {
        errors.push('must be a string');
      } else {
        if (
          field.validation?.minLength &&
          value.length < field.validation.minLength
        ) {
          errors.push(`is too short (min ${field.validation.minLength})`);
        }
        if (
          field.validation?.maxLength &&
          value.length > field.validation.maxLength
        ) {
          errors.push(`is too long (max ${field.validation.maxLength})`);
        }
        if (field.validation?.pattern) {
          const re = new RegExp(field.validation.pattern);
          if (!re.test(value)) {
            errors.push('does not match pattern');
          }
        }
      }
      break;

    case 'number':
    case 'float':
      if (typeof value !== 'number') {
        errors.push('must be a number');
      } else {
        if (
          field.validation?.min !== undefined &&
          value < field.validation.min
        ) {
          errors.push(`must be >= ${field.validation.min}`);
        }
        if (
          field.validation?.max !== undefined &&
          value > field.validation.max
        ) {
          errors.push(`must be <= ${field.validation.max}`);
        }
      }
      break;

    case 'date':
    case 'datetime':
      if (typeof value !== 'string' || isNaN(Date.parse(value))) {
        errors.push('must be a valid ISO date string');
      }
      break;

    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push('must be a boolean');
      }
      break;

    case 'color':
      if (
        typeof value !== 'string' ||
        !/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value)
      ) {
        errors.push('must be a valid color hex');
      }
      break;

    case 'select':
      if (!field.options?.includes(value)) {
        errors.push(`must be one of: ${field.options?.join(', ')}`);
      }
      break;

    case 'tags':
      if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
        errors.push('must be an array of strings');
      }
      break;

    case 'json':
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        errors.push('must be a JSON object');
      }
      break;

    case 'geolocation':
      if (
        typeof value !== 'object' ||
        typeof value.lat !== 'number' ||
        typeof value.lon !== 'number'
      ) {
        errors.push('must contain lat/lng as numbers');
      }
      break;

    case 'relation':
    case 'asset':
      if (field.relation?.multiple) {
        if (!Array.isArray(value) || !value.every((v) => v && v.entryId)) {
          errors.push('must be an array of relations');
        }
      } else {
        if (typeof value !== 'object' || !value.entryId) {
          errors.push('must be a relation object with entryId');
        }
      }
      break;

    default:
      errors.push(`has unknown type: ${field.type}`);
  }

  return errors;
}
