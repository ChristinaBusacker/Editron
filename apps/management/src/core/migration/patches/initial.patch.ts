import { MigrationPatch } from '../../helpers/decorators/patch.decorators';

@MigrationPatch({
  name: 'initial',
  forceUpgrade: false,
  values: {
    localizations: [
      {
        key: `general.save`,
        en: `Save`,
        de: `Speichern`,
        fr: `Sauvegarder`,
      },
      {
        key: `general.cancel`,
        en: `Cancel`,
        de: `Abbrechen`,
        fr: `Annuler`,
      },
      {
        key: `general.de`,
        en: `German`,
        de: `Deutsch`,
        fr: `Allemand`,
      },
      {
        key: `general.en`,
        en: `English`,
        de: `Englisch`,
        fr: `Anglais`,
      },
      {
        key: `general.fr`,
        en: `French`,
        de: `Französisch`,
        fr: `Français`,
      },
    ],
  },
})
export class InitialPatch {}
