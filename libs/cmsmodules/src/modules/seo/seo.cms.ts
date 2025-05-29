import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export const SeoCMSModule: ContentSchemaDefinition = {
  fields: [
    {
      name: 'metaTitle',
      type: 'singleline',
      localizable: true,
      validation: { maxLength: 60 },
    },
    {
      name: 'metaDescription',
      type: 'multiline',
      localizable: true,
      validation: { maxLength: 160 },
    },
    {
      name: 'ogImage',
      type: 'asset',
      localizable: false,
      relation: { schema: 'asset', multiple: false },
    },
  ],
};
