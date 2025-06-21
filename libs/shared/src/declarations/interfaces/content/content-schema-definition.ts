export type FieldType =
  | 'singleline' // Single line of text
  | 'multiline' // Multi-line plain text
  | 'html' // Rich HTML content (raw)
  | 'richtext' // Structured editor outputting HTML (design-safe)
  | 'slug' // URL-friendly string (lowercase, no spaces)
  | 'number' // Integer value
  | 'float' // Decimal number
  | 'date' // Date only (no time)
  | 'datetime' // Date and time
  | 'boolean' // True/false toggle
  | 'relation' // Reference to another content entry
  | 'asset' // File or image (could be treated as a relation)
  | 'color' // Color value (e.g., hex or rgba)
  | 'select' // Fixed value list (dropdown)
  | 'tags' // Free multi-select (array of strings)
  | 'json' // Arbitrary structured data
  | 'geolocation'; // Object with latitude/longitude

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface FieldDefinition {
  name: string;
  type: FieldType;
  localizable: boolean;
  validation?: FieldValidation;
  default?: any;
  options?: string[];
  isTitle?: boolean;
  relation?: {
    schema: string;
    multiple: boolean;
  };
}

export interface ContentSchemaDefinition {
  fields: FieldDefinition[];
}
