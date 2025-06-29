// copy-to-clipboard.directive.ts
import { Directive, HostListener, ElementRef } from '@angular/core';
import { SnackbarService } from '../services/snackbar/snackbar.service';

@Directive({
  selector: '[appCopyToClipboard]',
})
export class CopyToClipboardDirective {
  constructor(
    private el: ElementRef<HTMLElement>,
    private snackbar: SnackbarService,
  ) {
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
        this.snackbar.success('Copied to clipboard');
        setTimeout(() => {
          this.el.nativeElement.classList.remove('copied');
        }, 1000);
      })
      .catch(err => {
        console.error('Kopieren fehlgeschlagen:', err);
      });
  }
}
