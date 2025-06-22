import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ColorPickerComponent, ColorPickerDirective } from 'ngx-color-picker';

@Component({
  selector: 'lib-cms-color-editor',
  imports: [
    ColorPickerComponent,
    ColorPickerDirective,
    FormsModule,
    MatInputModule,
  ],
  templateUrl: './cms-color-editor.component.html',
  styleUrl: './cms-color-editor.component.scss',
})
export class CmsColorEditorComponent implements OnInit {
  @Input() control!: FormControl<string>;
  @Input() label = 'Color';
  public color = '#000000';

  public presetColors = [
    '#fff',
    '#000',
    '#2889e9',
    '#e920e9',
    '#fff500',
    'rgb(236,64,64)',
  ];

  onChange(color: string) {
    this.control.setValue(color);
  }

  getContrastColor(hex: string): string {
    if (!hex) return '#000';
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(c => c + c)
        .join('');
    }

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  ngOnInit(): void {
    this.color = this.control.value;
  }
}
