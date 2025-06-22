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
  data: EntryValue[];
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

export interface EntryVersion {
  id: string;
  version: number;
  isPublished: boolean;
  createdAt: Date;
  createdBy: {
    id: string;
    displayName: string;
  } | null;
  value: any;
}

export interface EntryDetails {
  id: string;
  value: any;
  versions: EntryVersion[];
}
