import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  inject,
  effect,
  signal, OnChanges,
} from '@angular/core';
import { formatDate as angularFormatDate } from '@angular/common';
import { LanguageService } from '../services/language/language.service';

@Directive({
  selector: '[formatDate]',
  standalone: true,
})
export class FormatDateDirective implements OnDestroy, OnChanges {
  @Input('formatDate') rawDate?: string | Date | null;
  @Input() format?: string;

  private renderer = inject(Renderer2);
  private el = inject(ElementRef<HTMLElement>);
  private langService = inject(LanguageService);

  private update = signal(0);
  private destroyEffect = effect(() => {
    const lang = this.langService.language();
    const rawDate = this.rawDate;
    const format = this.format ?? this.getDefaultFormat(lang);

    if (!rawDate) {
      this.renderer.setProperty(this.el.nativeElement, 'textContent', '');
      return;
    }

    const date = typeof rawDate === 'string' ? new Date(rawDate) : rawDate;

    if (isNaN(date.getTime())) {
      this.renderer.setProperty(this.el.nativeElement, 'textContent', '–');
      return;
    }

    const formatted = angularFormatDate(date, format, lang);
    this.renderer.setProperty(this.el.nativeElement, 'textContent', formatted);
  });

  ngOnDestroy(): void {
    this.destroyEffect.destroy();
  }

  ngOnChanges(): void {
    this.update.update(v => v + 1);
  }

  private getDefaultFormat(locale: string): string {
    switch (locale) {
      case 'de':
        return 'dd.MM.yyyy HH:mm';
      case 'en':
        return 'MM/dd/yyyy HH:mm';
      case 'fr':
        return 'dd/MM/yyyy HH:mm';
      default:
        return 'yyyy-MM-dd HH:mm';
    }
  }
}
