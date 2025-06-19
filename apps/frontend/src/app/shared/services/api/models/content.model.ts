import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export interface CreateEntry {
  data: any;
}
export interface EntryValue {
  fieldName: string;
  locale?: string;
  value: any;
}

export interface UpdateEntry {
  values: EntryValue[];
}

export interface ValidateEntryValue {
  fieldName: string;
  locale?: string;
  value: any;
}

export interface ValidateEntry {
  schemaDefinition: ContentSchemaDefinition;
  values: ValidateEntryValue[];
}
