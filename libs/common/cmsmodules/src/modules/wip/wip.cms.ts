import { CmsModule } from '../cms-module';
import { SeoCMSModule } from '../seo/seo.cms';

export const WipMSModule: CmsModule = {
  slug: 'wip',
  name: 'Wip Module',
  renderer: 'form',
  schema: {
    fields: [
      {
        name: 'singleline',
        type: 'singleline',
        isTitle: true,
        localizable: true,
        validation: { required: true, maxLength: 120 },
      },
      {
        name: 'multiline',
        type: 'multiline',
        localizable: true,
      },
      {
        name: 'html',
        type: 'html',
        localizable: true,
        validation: { required: true, maxLength: 120 },
      },
      {
        name: 'number',
        type: 'number',
        localizable: false,
        validation: { required: true },
      },
      {
        name: 'float',
        type: 'float',
        localizable: true,
        validation: { maxLength: 300 },
      },
      {
        name: 'richtext',
        type: 'richtext',
        localizable: true,
        validation: { required: true },
      },
      {
        name: 'date',
        type: 'date',
        localizable: false,
      },
      {
        name: 'datetime',
        type: 'datetime',
        localizable: false,
      },
      {
        name: 'boolean',
        type: 'boolean',
        localizable: false,
      },
      {
        name: 'color',
        type: 'color',
        localizable: false,
      },
      {
        name: 'select',
        type: 'select',
        localizable: false,
        options: ['a', 'b'],
      },
      {
        name: 'tags',
        type: 'tags',
        localizable: false,
      },
      {
        name: 'json',
        type: 'json',
        localizable: false,
      },
      {
        name: 'geolocation',
        type: 'geolocation',
        localizable: false,
      },
    ],
  },
  extensions: [SeoCMSModule],
};
