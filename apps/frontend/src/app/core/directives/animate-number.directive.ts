import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[animateNumber]',
})
export class AnimateNumberDirective implements OnChanges {
  @Input() animateNumber: number = 0;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    const duration = 2000;
    const start = 0;
    const end = this.animateNumber;
    const step = Math.ceil(end / (duration / 16));

    let current = start;
    const interval = setInterval(() => {
      current += step;
      if (current >= end) {
        current = end;
        clearInterval(interval);
      }
      this.el.nativeElement.textContent = current;
    }, 16);
  }
}
