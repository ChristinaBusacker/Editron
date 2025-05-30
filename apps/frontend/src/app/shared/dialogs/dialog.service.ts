import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from './children/create-project-dialog/create-project-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private readonly matDialog: MatDialog) {}

  openCreateProjectDialog() {
    return this.matDialog.open(CreateProjectDialogComponent, {
      maxWidth: '500px',
      width: '100%',
    });
  }
}
