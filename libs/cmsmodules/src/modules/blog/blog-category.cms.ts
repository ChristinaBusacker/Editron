import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';

export const BlogCategorySchema: ContentSchemaDefinition = {
  fields: [
    {
      name: 'name',
      type: 'singleline',
      localizable: true,
      validation: { required: true },
    },
    {
      name: 'slug',
      type: 'slug',
      localizable: false,
      validation: { required: true },
    },
    {
      name: 'color',
      type: 'color',
      localizable: false,
    },
    {
      name: 'description',
      type: 'multiline',
      localizable: true,
    },
  ],
};
