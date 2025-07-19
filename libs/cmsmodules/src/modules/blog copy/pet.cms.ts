import { CmsModule } from '../cms-module';

export const PetCMSModule: CmsModule = {
  slug: 'pet',
  name: 'Haustier',
  renderer: 'form',
  schema: {
    fields: [
      {
        name: 'name',
        type: 'singleline',
        localizable: true,
        validation: { required: true },
        isTitle: true,
      },
      {
        name: 'select',
        type: 'select',
        localizable: true,
        options: ['Katze', 'Hund', 'Hamster', 'Otter'],
      },
      {
        name: 'birthday',
        type: 'date',
        localizable: false,
      },
      {
        name: 'image',
        type: 'asset',
        localizable: false,
      },
      {
        name: 'siblings',
        type: 'relation',
        localizable: false,
        relation: {
          schema: 'pet',
          multiple: true,
        },
        validation: { required: false },
      },
    ],
  },
};
