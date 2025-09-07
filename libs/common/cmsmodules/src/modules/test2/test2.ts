import { CmsModule } from '../cms-module';

export const Test2Module: CmsModule = {
  slug: 'test2',
  name: 'Test Module',
  renderer: 'form',
  schema: {
    fields: [
      {
        name: 'singleline',
        type: 'singleline',
        isTitle: true,
        localizable: false,
        validation: { required: true, maxLength: 120 },
      },
      {
        name: 'number',
        type: 'number',
        localizable: true,
        validation: { required: true },
      },
      {
        name: 'html',
        type: 'html',
        localizable: false,
        validation: { required: true, maxLength: 120 },
      },
      {
        name: 'select',
        type: 'select',
        localizable: true,
        options: ['Mojito', 'Gimlet', 'Tequila Sunrise'],
      },
    ],
  },
  extensions: [],
};
