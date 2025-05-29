import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import { CmsModule } from '../cms-module';
import { SeoCMSModule } from '../seo/seo.cms';

export class BlogCMSModule implements CmsModule {
  readonly slug = 'blog';
  readonly name = 'Blog Article';

  readonly schema: ContentSchemaDefinition = {
    fields: [
      {
        name: 'title',
        type: 'singleline',
        localizable: true,
        validation: { required: true, maxLength: 120 },
      },
      {
        name: 'category',
        type: 'relation',
        localizable: false,
        relation: {
          schema: 'blog_category',
          multiple: false,
        },
        validation: { required: true },
      },
      {
        name: 'slug',
        type: 'slug',
        localizable: false,
        validation: { required: true },
      },
      {
        name: 'summary',
        type: 'multiline',
        localizable: true,
        validation: { maxLength: 300 },
      },
      {
        name: 'content',
        type: 'richtext',
        localizable: true,
        validation: { required: true },
      },
      {
        name: 'tags',
        type: 'tags',
        localizable: false,
      },
      {
        name: 'coverImage',
        type: 'asset',
        localizable: false,
        relation: { schema: 'asset', multiple: false },
      },
      {
        name: 'visibleFrom',
        type: 'datetime',
        localizable: false,
        validation: {},
      },
    ],
  };

  extensions?: Record<string, ContentSchemaDefinition> = {
    seo: SeoCMSModule,
  };
}
