import { CmsModule } from '../cms-module';

export const BlogCategoryCMSModule: CmsModule = {
  slug: 'blog_category',
  name: 'Blog Category',
  renderer: 'form',
  schema: {
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
  },
};
