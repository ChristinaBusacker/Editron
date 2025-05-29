import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export interface CmsModule {
  slug: string;
  name: string;
  schema: ContentSchemaDefinition;
  extensions?: Record<string, ContentSchemaDefinition>;
}
