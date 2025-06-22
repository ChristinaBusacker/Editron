// copy-to-clipboard.directive.ts
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]',
})
export class CopyToClipboardDirective {
  constructor(private el: ElementRef<HTMLElement>) {
    this.el.nativeElement.classList.add('clipboard-area');
  }

  @HostListener('click')
  copyText(): void {
    const text =
      this.el.nativeElement.innerText ||
      this.el.nativeElement.textContent ||
      '';
    navigator.clipboard
      .writeText(text.trim())
      .then(() => {
        this.el.nativeElement.classList.add('copied');
        setTimeout(() => {
          this.el.nativeElement.classList.remove('copied');
        }, 1000);
      })
      .catch(err => {
        console.error('Kopieren fehlgeschlagen:', err);
      });
  }
}
