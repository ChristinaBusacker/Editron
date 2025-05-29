export class SetLanguage {
  static readonly type = '[Localization] Set Language';
  constructor(public language: 'de' | 'fr' | 'en') {}
}
