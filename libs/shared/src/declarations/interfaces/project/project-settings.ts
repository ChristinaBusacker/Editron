import { CmsModule } from 'libs/cmsmodules/src/modules/cms-module';

export interface LanguageDefinition {
  name: string; // "Deutsch"
  isoCode: string; // "de"
  locale: string; // "de-DE"
  rtl?: boolean;
}

export interface ProjectSettings {
  languages: Array<string>;
  defaultLanguage: string;
  colorPalett?: Array<string>;
  modules: Array<string>;
}

export const LANGUAGES: LanguageDefinition[] = [
  {
    name: 'German (Germany)',
    isoCode: 'de',
    locale: 'de-DE',
  },
  {
    name: 'German (Austria)',
    isoCode: 'de',
    locale: 'de-AT',
  },
  {
    name: 'German (Switzerland)',
    isoCode: 'de',
    locale: 'de-CH',
  },
  {
    name: 'English (United States)',
    isoCode: 'en',
    locale: 'en-US',
  },
  {
    name: 'English (United Kingdom)',
    isoCode: 'en',
    locale: 'en-GB',
  },
  {
    name: 'French',
    isoCode: 'fr',
    locale: 'fr-FR',
  },
  {
    name: 'Italian',
    isoCode: 'it',
    locale: 'it-IT',
  },
  {
    name: 'Spanish',
    isoCode: 'es',
    locale: 'es-ES',
  },
  {
    name: 'Dutch',
    isoCode: 'nl',
    locale: 'nl-NL',
  },
];
