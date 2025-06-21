import { CmsModule } from '../cms-module';

export const SeoCMSModule: CmsModule = {
  slug: 'seo',
  name: 'Search Engine Optimisation',
  renderer: 'form',
  schema: {
    fields: [
      {
        name: 'metaTitle',
        type: 'singleline',
        isTitle: true,
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
  },
};
