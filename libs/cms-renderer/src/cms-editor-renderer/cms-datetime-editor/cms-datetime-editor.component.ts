import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';

@Component({
  selector: 'lib-cms-datetime-editor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatTimepickerModule,
  ],
  templateUrl: './cms-datetime-editor.component.html',
  styleUrl: './cms-datetime-editor.component.scss',
})
export class CmsDatetimeEditorComponent implements OnInit {
  @Input() control!: FormControl<string>;

  date!: Date;
  time!: Date;

  ngOnInit(): void {
    const initial = this.control?.value
      ? new Date(this.control?.value)
      : new Date();
    this.date = new Date(initial);
    this.time = new Date(initial);
  }

  onDateChange(newDate: Date): void {
    const h = this.time.getHours();
    const m = this.time.getMinutes();
    newDate.setHours(h, m);
    this.date = newDate;
    this.updateControl();
  }

  onTimeChange(newTime: Date): void {
    const h = newTime.getHours();
    const m = newTime.getMinutes();
    this.time = newTime;
    const newDate = new Date(this.date);
    newDate.setHours(h, m);
    this.updateControl(newDate);
  }

  private updateControl(date: Date = this.date): void {
    const h = this.time.getHours();
    const m = this.time.getMinutes();
    const d = new Date(date);
    d.setHours(h, m);
    this.control.setValue(d.toISOString());
    this.control.markAsDirty();
    this.control.markAsTouched();
  }

  private getTimeString(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  }
}
