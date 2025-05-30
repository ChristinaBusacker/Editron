import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { DialogButtonOptions } from '@frontend/core/declarations/interfaces/dialog.interfaces';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  @Input() buttonOptions: DialogButtonOptions;
  @Output() action = new EventEmitter<string>();
}
