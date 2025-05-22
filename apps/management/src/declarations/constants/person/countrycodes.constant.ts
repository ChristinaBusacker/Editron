export type SUPPORTED_COUNTRY_CODES =
  | 'de'
  | 'en'
  | 'fr'
  | 'es'
  | 'it'
  | 'sv'
  | 'pl'
  | 'zh'
  | 'jp'
  | 'th'
  | 'sa'
  | 'dz'
  | 'eg'
  | 'za'
  | 'na'
  | 'ma'
  | 'tr'
  | 'ar'
  | 'br'
  | 'ca'
  | 'co'
  | 'mx'
  | 'us'
  | 'au'
  | 'ua'
  | 'fi'
  | 'ao'
  | 'nz'
  | 'is'
  | 'ch'
  | 'at'
  | 'pt'
  | 'no'
  | 'lv'
  | 'ro'
  | 'in'
  | 'gr'
  | 'kr'
  | 'vn'
  | 'sc'
  | 'ie';

export type SUPPORTED_REGIONS =
  | 'europe'
  | 'asia'
  | 'africa'
  | 'north_america'
  | 'south_america'
  | 'oceania';

export const COUNTRY_CODES: SUPPORTED_COUNTRY_CODES[] = [
  'de',
  'en',
  'fr',
  'es',
  'it',
  'sv',
  'pl',
  'zh',
  'jp',
  'th',
  'sa',
  'dz',
  'eg',
  'za',
  'na',
  'ma',
  'tr',
  'ar',
  'br',
  'ca',
  'co',
  'mx',
  'us',
  'au',
  'ua',
  'fi',
  'ao',
  'nz',
  'is',
  'ch',
  'at',
  'pt',
  'no',
  'lv',
  'ro',
  'in',
  'gr',
  'kr',
  'vn',
  'sc',
  'ie',
];

export const COUNTRY_BY_REGION: { [key: string]: SUPPORTED_COUNTRY_CODES[] } = {
  europe: [
    'de',
    'en',
    'fr',
    'it',
    'sv',
    'pl',
    'ua',
    'fi',
    'is',
    'ch',
    'at',
    'pt',
    'no',
    'lv',
    'ro',
    'gr',
    'ie',
    'sc',
  ],
  asia: ['zh', 'jp', 'th', 'sa', 'tr', 'in', 'kr', 'vn'],
  africa: ['dz', 'eg', 'za', 'na', 'ma', 'ao'],
  north_america: ['us', 'ca', 'mx'],
  south_america: ['ar', 'br', 'co'],
  oceania: ['au', 'nz'],
};
