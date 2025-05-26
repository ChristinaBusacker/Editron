export type FieldType = 'string' | 'number' | 'boolean' | 'richtext' | 'image';

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
}

export interface ContentSchemaDefinition {
  fields: FieldDefinition[];
}
