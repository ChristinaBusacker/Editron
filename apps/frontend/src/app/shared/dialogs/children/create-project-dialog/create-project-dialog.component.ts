import { Component, HostListener, inject, signal } from '@angular/core';
import { DialogComponent } from '../../dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreateProject } from '@frontend/core/store/project/project.actions';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    DialogComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.scss',
})
export class CreateProjectDialogComponent {
  dialogRef = inject(MatDialogRef<CreateProjectDialogComponent>);
  name = signal('');
  nameTouched = signal(false);

  constructor(private store: Store) {}

  get nameValid(): boolean {
    return this.name().trim().length >= 3;
  }

  get nameInvalid(): boolean {
    return this.nameTouched() && !this.nameValid;
  }

  close(action: 'confirm' | 'cancel') {
    if (action === 'confirm') {
      this.nameTouched.set(true);
      if (!this.nameValid) return;
      this.store
        .dispatch(new CreateProject({ name: this.name() }))
        .subscribe(() => {
          this.dialogRef.close({ action, data: { name: this.name() } });
        });
    } else {
      this.dialogRef.close({ action, data: {} });
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    event.preventDefault();
    this.close('confirm');
  }

  @HostListener('document:keydown.esc', ['$event'])
  handleEscape(event: KeyboardEvent) {
    event.preventDefault();
    this.close('cancel');
  }
}
