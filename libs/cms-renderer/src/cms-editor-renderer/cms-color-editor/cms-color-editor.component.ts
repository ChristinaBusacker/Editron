import { Component, Input } from '@angular/core';
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
export class CmsColorEditorComponent {
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
}
