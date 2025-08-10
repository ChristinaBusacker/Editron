import { CmsModule } from '../cms-module';
import { SeoCMSModule } from '../seo/seo.cms';

export const HomepageCMSModule: CmsModule = {
  slug: 'homepage',
  name: 'Homepage',
  renderer: 'homepage',
  schema: {
    fields: [
      {
        name: 'title',
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
        name: 'content',
        type: 'content',
        localizable: true,
        validation: { required: true },
      },
    ],
  },
  extensions: [SeoCMSModule],
};
