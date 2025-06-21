import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { User } from '@frontend/shared/services/api/models/user.model';

@Directive({
  selector: '[userBadge]',
})
export class UserBadgeDirective implements OnInit, OnChanges {
  @Input('userBadge') user!: User;
  @Input() size = 40;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    if (!this.user) return;
    this.renderBadge();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('user' in changes && this.user) {
      this.renderBadge();
    }
  }

  private renderBadge() {
    const bgColor = this.getColorFromId(this.user.id);
    const textColor = this.getContrastColor(bgColor);
    const initials = this.getInitials(this.user.name);

    const native = this.el.nativeElement as HTMLElement;
    native.innerText = initials;

    this.renderer.setStyle(native, 'background-color', bgColor);
    this.renderer.setStyle(native, 'color', textColor);
    this.renderer.setStyle(native, 'border-radius', '50%');
    this.renderer.setStyle(native, 'width', `${this.size}px`);
    this.renderer.setStyle(native, 'height', `${this.size}px`);
    this.renderer.setStyle(native, 'display', 'flex');
    this.renderer.setStyle(native, 'align-items', 'center');
    this.renderer.setStyle(native, 'justify-content', 'center');
    this.renderer.setStyle(native, 'font-weight', 'bold');
    this.renderer.setStyle(native, 'font-size', `${this.size / 2}px`);
    this.renderer.setStyle(native, 'user-select', 'none');
  }

  private getInitials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }

  private getColorFromId(id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
  }

  private getContrastColor(bgColor: string): string {
    // hsl to rgb
    const hsl = bgColor.match(/hsl\((\d+),\s?(\d+)%,\s?(\d+)%\)/);
    if (!hsl) return '#000';

    const h = parseInt(hsl[1], 10);
    const s = parseInt(hsl[2], 10) / 100;
    const l = parseInt(hsl[3], 10) / 100;

    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return Math.round(255 * color);
    };

    const [r, g, b] = [f(0), f(8), f(4)];
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 150 ? '#000' : '#fff';
  }
}
