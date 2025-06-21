import { Injectable, computed, signal } from '@angular/core';

export type SupportedLanguage = 'de' | 'en' | 'fr';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly supportedLanguages: SupportedLanguage[] = ['de', 'en', 'fr'];

  private readonly initialLanguage = this.detectLanguage();
  readonly language = signal<SupportedLanguage>(this.initialLanguage);

  readonly dateFormat = computed(() => {
    switch (this.language()) {
      case 'de':
        return 'dd.MM.yyyy HH:mm';
      case 'fr':
        return "'D'd-MM-yyyy HH:mm";
      case 'en':
      default:
        return 'MM/dd/yyyy hh:mm a';
    }
  });

  /**
   * Format numbers
   */
  formatNumber(
    value: number,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  ): string {
    return new Intl.NumberFormat(this.language(), {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  }

  /**
   * Set language
   */
  setLanguage(lang: string): void {
    if (this.supportedLanguages.includes(lang as SupportedLanguage)) {
      this.language.set(lang as SupportedLanguage);
      console.log(`[LanguageService] Sprache geändert zu: ${lang}`);
    } else {
      console.warn(
        `[LanguageService] Ungültige Sprache "${lang}", erlaubt sind: ${this.supportedLanguages.join(', ')}`,
      );
    }
  }

  private detectLanguage(): SupportedLanguage {
    const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
    if (this.supportedLanguages.includes(browserLang as SupportedLanguage)) {
      return browserLang as SupportedLanguage;
    }
    return 'en';
  }
}
